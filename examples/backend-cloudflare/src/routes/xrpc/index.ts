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
  const url = new URL(c.req.url)

  console.log("xrpcProxy.url:", url)
  console.log("xrpcProxy.method:", c.req.method)
  console.log("xrpcProxy.path:", c.req.path)
  console.log("xrpcProxy.headers:", c.req.headers)
  console.log("xrpcProxy.search:", c.req.search)
  console.log("xrpcProxy.body:", c.req.body)

 // Get authr cookie and session details
  const authr_session = await getSession(c)
  if (!authr_session) {
    return c.json({
      error: 'Session not found',
    }, 401)
  }

  // TODO, we only want to use the session pds if the request is for the current user repo...
  // proxy with fetch and headers (auth & at-proxy)
  let proxyUrl = `${authr_session.pds}${url.pathname}${url.search}`
  console.log("xrpcProxy.proxyUrl:", proxyUrl)

  // const oauthPrefix = '/xrpc/@atproto'
  // let oauthHeaders: any = {}
  // if (url.pathname.startsWith(oauthPrefix)) {
  //   proxyUrl = `https://bsky.social${url.pathname.substring(5)}${url.search}`
  //   oauthHeaders = {
  //     'sec-fetch-mode': 'same-origin',
  //     'sec-fetch-site': 'same-origin',
  //     'referer': `https://bsky.social/account/${authr_session.did}`
  //   }

  // }

  // Get oauth session from KV
  const results = await c.env.KV.get(authr_session.did)
  console.log("xrpcProxy.KV.results:", results)

  const oauth_session = JSON.parse(results as string)
  console.log("xrpcProxy.oauth_session:", oauth_session)

  const dpop_jwt = await genDpopProof(c.req.method, oauth_session, proxyUrl)

  const resp = await fetch(proxyUrl, {
    method: c.req.method,
    headers: {
      // 'Content-Type': c.req.header('Content-Type') || 'application/json',
      // 'Accept': c.req.header('Accept') || 'application/json',
      'Authorization': `DPoP ${oauth_session.access_token}`,
      'DPoP': dpop_jwt,
      'atproto-proxy': c.req.header('atproto-proxy'),
      // ...oauthHeaders,
    },
    body: c.req.body,
  })

  console.log("xrpcProxy.resp1:", resp)

  if (resp.status === 400 || resp.status === 401) {
    const nonce = resp.headers.get('dpop-nonce')
    // const cookies = setCookie.parse(resp, { decodeValues: true }) 



    const data: any = await resp.json()
    console.log("xrpcProxy.401x.data:", data)
    // console.log("xrpcProxy.401x.cookies:", cookies)
    if (data.error && (data.error === "use_dpop_nonce" || data.error_description === 'CSRF mismatch')) {

      // for (const cookie of cookies) {
      //   if (cookie.name === 'csrf-token') {
      //     oauthHeaders['cookie'] = `${cookie.name}=${cookie.value}`
      //     oauthHeaders['X-CSRF-Token'] = cookie.value
      //     break
      //   }
      // }

      const dpop_jwt = await genDpopProof(c.req.method, oauth_session, proxyUrl, nonce as string)

      const headers = {
        // 'Content-Type': c.req.header('Content-Type') || 'application/json',
        // 'Accept': c.req.header('Accept') || 'application/json',
        'Authorization': `dpop ${oauth_session.access_token}`,
        'DPoP': dpop_jwt,
        'atproto-proxy': c.req.header('atproto-proxy'),
        // ...oauthHeaders,
      }
      // console.log("xrpcProxy.resp2.oauthHeaders:", oauthHeaders)
      console.log("xrpcProxy.resp2.headers:", headers)

      const resp2 = await fetch(proxyUrl, {
        method: c.req.method,
        headers,
        body: c.req.body,
      })

      console.log("xrpcProxy.resp2:", resp2)
      return resp2
    }
    return c.json(data)
  }

  return resp;
}

async function genDpopProof(method: string, oauth_session: any, proxyUrl: string, nonce?: string) {
  // console.log("c.env:", c.env);

  console.log("xrpcProxy.oauth_session:", oauth_session)
  const at_session = JSON.parse(oauth_session.session)
  console.log("xrpcProxy.at_session:", at_session)

  // at_session.dpopJwk.alg = "ES256"
  const tKey = await JoseKey.fromJWK(at_session.dpopJwk)
  console.log("xrpcProxy.tKey:", tKey);

  // Calculate pkcs_access_token (base64url encoded SHA-256 hash of the access token)
  const accessToken = oauth_session.access_token;
  const accessTokenHash = await calcATH(accessToken);
  // console.log("xrpcProxy.pkcsAccessToken:", accessTokenHash);
  const claims = jose.decodeJwt(accessToken)
  console.log("xrpcProxy.claims:", claims);

  const jti = createJTI();
  // console.log("xrpcProxy.jti:", jti);

  const pUrl = new URL(proxyUrl);
  const htu = `${pUrl.protocol}//${pUrl.host}${pUrl.pathname}`;
  // console.log("xrpcProxy.htu:", htu);

  // for iat/exp
  const now = new Date();
  const inow = Math.floor(now.getTime() / 1000); // Issued at time (seconds since epoch)

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

  // console.log("xrpcProxy.tKey.alg:", tKey.alg);
  // console.log("xrpcProxy.tKey.algorithms:", tKey.algorithms);


  console.log("xrpcProxy.dpop_headers:", dpop_headers);
  console.log("xrpcProxy.dpop_payload:", dpop_payload);

  // Create DPoP JWT
  console.log("xrpcProxy.tKey.alg:", tKey.alg);
  const dpop_jwt = await tKey.createJwt(dpop_headers, dpop_payload)
  console.log("xrpcProxy.dpop_jwt:", dpop_jwt);

  return dpop_jwt;
}

async function calcATH(access_token: string) {

  // Calculate pkcs_access_token (base64url encoded SHA-256 hash of the access token)
  console.log("xrpcProxy.calcATH.access_token:", access_token);
  // const encodedToken = new TextEncoder().encode(access_token);
  // const hashBuffer = await crypto.subtle.digest('SHA-256', encodedToken);

  // // Convert ArrayBuffer to Base64 string
  // const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  // const base64Hash = btoa(String.fromCharCode.apply(null, hashArray)); // convert bytes to base64 string

  // // Convert Base64 to Base64URL and remove padding
  // const pkcsAccessToken = base64Hash
  //   .replace(/\+/g, '-')
  //   .replace(/\//g, '_')
  //   .replace(/=/g, '');

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

  // return pkcsAccessToken;
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
  console.log("config:", config)

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