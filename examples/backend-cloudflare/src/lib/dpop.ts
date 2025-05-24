import { JoseKey } from '@atproto/jwk-jose'
import * as jose from 'jose'

export async function genDpopProof(method: string, oauth_session: any, proxyUrl: string, nonce?: string) {

  // the original session object created by oauth login/callback
  const at_session = JSON.parse(oauth_session.session)
  // access token is a JWT
  const accessToken = oauth_session.access_token;

  // each session has a unique dpop key

  // Calculate pkcs_access_token (base64url encoded SHA-256 hash of the access token)
  const accessTokenHash = await calcATH(accessToken);

  // extract the claims from the access token
  // const claims = jose.decodeJwt(accessToken)

  // create a unique identifier for the DPoP proof
  const jti = createJTI();

  // clean up the proxy URL
  const pUrl = new URL(proxyUrl);
  const htu = `${pUrl.protocol}//${pUrl.host}${pUrl.pathname}`;

  // for token times (iat/exp)
  const now = new Date();
  const inow = Math.floor(now.getTime() / 1000); // Issued at time (seconds since epoch)

  // per-account DPoP key
  const dpopKey = await JoseKey.fromJWK(at_session.dpopJwk)

  // build the inputs to the DPoP proof (JWT)
  const dpop_headers = {
    alg: "ES256",
    jwk: dpopKey.bareJwk,
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
  const dpop_jwt = await dpopKey.createJwt(dpop_headers, dpop_payload)

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

