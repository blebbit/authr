import { Request, Response, NextFunction } from 'express';
import { JoseKey } from '@atproto/jwk-jose'
import * as jose from 'jose'

import { db } from '@/db/client';

/* todo:
  - better path handling, xrpc comes in a variety of formats
  - better error handling
  - handle mutations and payloads
  - caching responses
*/ 

export const handleXrpcAgent = async (req: Request, res: Response, next: NextFunction) => {
  // note the lack of error handling here... ¯\_(ツ)_/¯

  const nsid = req.path.substring(6)
  // console.log("xrpc.nsid:", nsid)

  const resp = await req.agent.call(
    nsid,
    req.query,
    req.body,
    {
      headers: req.headers
    }
  )
  console.log("xrpc.resp:", resp)

  res.status(200).json(resp.data)
};

export const handleXrpcManual = async (req: Request, res: Response, next: NextFunction) => {
  console.log("xrpcProxy.url:", req.originalUrl)
  console.log("xrpcProxy.method:", req.method)
  console.log("xrpcProxy.path:", req.path)
  console.log("xrpcProxy.headers:", req.headers)
  console.log("xrpcProxy.search:", req.query)
  console.log("xrpcProxy.body:", req.body)

  const db_session = await db
    .selectFrom("oauth_session")
    .where("key", "=", req.session.did)
    .selectAll()
    .executeTakeFirst()

  if (!db_session) {
    return res.status(404).json({ message: "Session not found" });
  }
  console.log("xrpcProxy.result:", db_session)

  const at_session = JSON.parse(db_session.session)
  console.log("xrpcProxy.at_session:", at_session)

  const tKey = await JoseKey.fromJWK(at_session.dpopJwk)
  console.log("xrpcProxy.tKey:", tKey);

  const proxyUrl = `${req.session.pds}${req.originalUrl}`
  console.log("xrpcProxy.proxyUrl:", proxyUrl)

  const dpop_jwt = await genDpopProof(req.method, at_session, proxyUrl, req?.query?.nonce as string)
  console.log("xrpcProxy.dpop_jwt:", dpop_jwt);

  const resp = await fetch(proxyUrl, {
    method: req.method,
    headers: {
      // 'Content-Type': c.req.header('Content-Type') || 'application/json',
      // 'Accept': c.req.header('Accept') || 'application/json',
      'Authorization': `DPoP ${req.session.access_token}`,
      'DPoP': dpop_jwt,
      // 'atproto-proxy': req.headers['atproto-proxy'],
    },
    body: req.body,
  })

  console.log("xrpcProxy.resp1:", resp)

  if (resp.status === 401) {
    const data: any = await resp.json()
    console.log("xrpcProxy.401.data:", data)
    if (data.error && data.error === "use_dpop_nonce") {
      const nonce = resp.headers.get('dpop-nonce')

      const dpop_jwt = await genDpopProof(req.method, at_session, proxyUrl, nonce as string)
      const resp2 = await fetch(proxyUrl, {
        method: req.method,
        headers: {
          // 'Content-Type': req.header('Content-Type') || 'application/json',
          // 'Accept': req.header('Accept') || 'application/json',
          'Authorization': `dpop ${req.session.access_token}`,
          'DPoP': dpop_jwt,
          // 'atproto-proxy': req.headers['atproto-proxy'],
        },
        body: req.body,
      })

      // console.log("xrpcProxy.resp2:", resp2)
      const data: any = await resp2.json()
      console.log("xrpcProxy.resp2.data:", data)
      return res.status(200).json(data)
    }
    return res.status(200).json(data)
  }

  return resp;
}

async function genDpopProof(method: string, at_session: any, proxyUrl: string, nonce?: string) {
  // console.log("c.env:", c.env);

  const tKey = await JoseKey.fromJWK(at_session.dpopJwk)
  console.log("xrpcProxy.tKey:", tKey);

  // Calculate pkcs_access_token (base64url encoded SHA-256 hash of the access token)
  const accessToken = at_session.tokenSet.access_token;
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


// export const handleXrpc = handleXrpcAgent
export const handleXrpc = handleXrpcManual
