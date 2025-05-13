import { Hono, Context } from 'hono'
import { getCookie } from 'hono/cookie'
import { JoseKey } from '@atproto/jwk-jose'
import * as jose from 'jose'

import { getConfig } from '../../config'

// only export
export function addRoutes(app: Hono) {
  app.get('/xrpc/*', xrpcProxy)
  app.post('/xrpc/*', xrpcProxy)
}

// handlers
async function xrpcProxy(c: Context) {

 // Get authr session details
  const authr_session = await getSession(c)
  if (!authr_session) {
    return c.json({
      error: 'Session not found',
    }, 401)
  }

  // Lookup oauth session in KV
  const results = await c.env.KV.get(authr_session.did)
  // console.log("xrpcProxy.KV.results:", results)

  if (!results && c.req.method === 'POST') {
    return c.json({
      error: 'Session not found',
    }, 401)
  }
  const oauth_session = JSON.parse(results as string)
  // console.log("xrpcProxy.oauth_session:", oauth_session)


  // TODO, this is where we need to handle permissions too, if enabled
  // TODO, we only want to use the session pds if the request is for the current user repo...


  // construct our proxied URL
  const url = new URL(c.req.url)
  let proxyUrl = `${authr_session.pds}${url.pathname}${url.search}`
  console.log("xrpcProxy.proxyUrl:", proxyUrl)

  // setup common headers
  const commonHeaders: any = {
    'Content-Type': c.req.header('Content-Type') || 'application/json',
    'Accept': c.req.header('Accept') || 'application/json',
    'Authorization': `DPoP ${oauth_session.access_token}`,
  }
  const ap = c.req.header('atproto-proxy')
  if (ap && ap.length > 0) {
    commonHeaders['atproto-proxy'] = ap
  }

  // generate DPoP proof
  const dpop_jwt = await genDpopProof(c.req.method, oauth_session, proxyUrl)

  // construct payload
  const payload1: any = {
    method: c.req.method,
    headers: {
      ...commonHeaders,
      'DPoP': dpop_jwt,
    },
  }
  if (c.req.method === 'POST') {
    payload1.body = await c.req.text()
  }

  // send request, likely to fail with 401 because we need a DPoP nonce
  const resp = await fetch(proxyUrl, payload1)
  // console.log("xrpcProxy.resp1:", resp)

  // bad request, let's try to fix it (most often dpop nonce)
  if (resp.status === 400 || resp.status === 401) {
    const nonce = resp.headers.get('dpop-nonce')

    const data: any = await resp.json()
    if (data.error && (data.error === "use_dpop_nonce" || data.error_description === 'CSRF mismatch')) {

      // calculate new dpop proof with nonce
      const dpop_jwt = await genDpopProof(c.req.method, oauth_session, proxyUrl, nonce as string)

      const payload2: any = {
        method: c.req.method,
        headers: {
          ...commonHeaders,
          'DPoP': dpop_jwt,
        },
      }
      if (c.req.method === 'POST') {
        payload2.body = await c.req.text()
      }

      const resp2 = await fetch(proxyUrl, payload2)

      // console.log("xrpcProxy.resp2:", resp2)
      return resp2
    }
    return c.json(data)
  }

  return resp;
}

async function genDpopProof(method: string, oauth_session: any, proxyUrl: string, nonce?: string) {

  // the original session object created by oauth login/callback
  const at_session = JSON.parse(oauth_session.session)
  // access token is a JWT
  const accessToken = oauth_session.access_token;

  // each session has a unique dpop key
  const tKey = await JoseKey.fromJWK(at_session.dpopJwk)

  // Calculate pkcs_access_token (base64url encoded SHA-256 hash of the access token)
  const accessTokenHash = await calcATH(accessToken);

  // extract the claims from the access token
  const claims = jose.decodeJwt(accessToken)

  // create a unique identifier for the DPoP proof
  const jti = createJTI();

  // clean up the proxy URL
  const pUrl = new URL(proxyUrl);
  const htu = `${pUrl.protocol}//${pUrl.host}${pUrl.pathname}`;

  // for token times (iat/exp)
  const now = new Date();
  const inow = Math.floor(now.getTime() / 1000); // Issued at time (seconds since epoch)

  // build the inputs to the DPoP proof (JWT)
  const dpop_headers = {
    alg: "ES256",
    jwk: tKey.bareJwk,
    typ: "dpop+jwt",
  }
  const dpop_payload = {
    jti,  // unique token per request
    htm: method, // HTTP method
    htu: htu, // HTTP target URI, without query and fragment parts
    ath: accessTokenHash, // Access token hash
    iat: inow,
    exp: inow + 60, // Expiration time (1 minute from now)
    nonce: nonce || undefined, // Use the generated nonce
    iss: at_session.tokenSet.iss, // Issuer
  };

  // Create DPoP JWT with our session key
  const dpop_jwt = await tKey.createJwt(dpop_headers, dpop_payload)

  return dpop_jwt;
}

async function calcATH(access_token: string) {

  const bytes = new TextEncoder().encode(access_token)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  const digestBytes = new Uint8Array(digest)
  // return base64url.baseEncode(digestBytes)
  const base64Hash = btoa(String.fromCharCode.apply(null, digestBytes)); // convert bytes to base64 string
  const ath = base64Hash
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  return ath
}

function createJTI() {
  // Generate JTI (JWT ID) - a unique identifier for the DPoP proof
  const randomBytes = crypto.getRandomValues(new Uint32Array(16)); // 16 * 4 = 64 bytes = 128 hex characters
  const jtiHash = Array.from(randomBytes, (byte) => byte.toString(16).padStart(8, '0')).join('');
  const jti = jtiHash
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  return jti;
}

export type Session = {
  did: string,
  pds: string,
  handle: string,
}

export const DefaultSession: Session = {
  did: "",
  pds: "",
  handle: "",
};

export async function getSession(c: Context): Promise<Session | null> {
  const config = getConfig(c.env)
  // console.log("config:", config)

  const cookie = getCookie(c, config.cookie.name);

  if (!cookie) {
    console.log(`Cookie '${config.cookie.name}' not found.`);
    return null;
  }

  try {
    // import an ES module in a CommonJS module. Specifically, the jose library is now distributed as an ES module, and your index.ts file is being treated as a CommonJS module.
    const jose = await import('jose');

    // console.log("getSession.cookie:", config.cookie);

    // Verify and decode the JWT using jwtVerify from jose
    const payload = await jose.decodeJwt(cookie)
    // console.log("getSession.payload:", payload);

    return payload as Session;
  } catch (error) {
    console.error('Error verifying session JWT:', error);
    return null; // or handle the error as needed
  }
}
