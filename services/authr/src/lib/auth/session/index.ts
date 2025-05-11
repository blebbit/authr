import { Request, Response } from 'express';

import config from '../../../config';

// TODO, migrate this to use a JWKS keyset like we do in atproto oauth?
//       allows for better key rotation and management
// https://github.com/panva/jose/blob/38737671a2e0515b1d8a782a3a9ec38f7798c528/docs/jwt/verify/functions/jwtVerify.md#example

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

export async function addSession(req: Request, res: Response, user: Session) {

  // create payload for JWT
  const payload = {
    sub: user.did,
    ...user,
  }

  // console.log("addSession.payload:", payload);

  try {
    // import an ES module in a CommonJS module. Specifically, the jose library is now distributed as an ES module, and your index.ts file is being treated as a CommonJS module.
    const jose = await import('jose');

    // Create and Sign the JWT using SignJWT from jose
    const jwt = await new jose.SignJWT(payload)
        .setProtectedHeader({ alg: config.cookie.alg })
        .setIssuedAt()
        .setIssuer(config.cookie.issuer)
        .setAudience(config.cookie.audience)
        .setExpirationTime(config.cookie.expirationTime)
        .sign(config.cookie.secret);

    // Set the JWT as a cookie ont he response
    res.cookie(config.cookie.name, jwt, {
        httpOnly: config.cookie.httpOnly,
        secure: config.cookie.secure,
        sameSite: config.cookie.sameSite as 'lax' | 'strict' | 'none' | undefined,
        maxAge: config.cookie.expirationMillis,
        path: config.cookie.path,
        domain: config.cookie.domain
    });

    // console.log(`Cookie '${config.cookie.name}' set.`);
    // Verify and decode the JWT using jwtVerify from jose

    // also return from the function, helpful when refreshing in middleware
    const { payload: retPayload } = await jose.jwtVerify(jwt, config.cookie.secret, {
      issuer: config.cookie.issuer,
      audience: config.cookie.audience,
    });

    // console.log("getSession.payload:", payload);

    return retPayload as Session;

  } catch (error) {
    console.error('Error creating session JWT or setting cookie:', error);
    // Depending on your error handling strategy, you might:
    // - Throw the error to be caught by a higher-level error handler
    // - Send an error response directly (e.g., res.status(500).send(...))
    throw error; // Re-throw for caller to handle
  }
}

export async function getSession(req: Request): Promise<Session | null> {
  const cookie = req.cookies[config.cookie.name];

  if (!cookie) {
    console.log(`Cookie '${config.cookie.name}' not found.`);
    return null;
  }

  try {
    // import an ES module in a CommonJS module. Specifically, the jose library is now distributed as an ES module, and your index.ts file is being treated as a CommonJS module.
    const jose = await import('jose');

    // Verify and decode the JWT using jwtVerify from jose
    const { payload } = await jose.jwtVerify(cookie, config.cookie.secret, {
      issuer: config.cookie.issuer,
      audience: config.cookie.audience,
    });

    // console.log("getSession.payload:", payload);

    return payload as Session;
  } catch (error) {
    // console.error('Error verifying session JWT:', error);
    throw error;
  }
}

export async function removeSession(req: Request, res: Response) {
  // Remove the cookie by setting its expiration date to the past
  res.cookie(config.cookie.name, '', {
    httpOnly: config.cookie.httpOnly,
    secure: config.cookie.secure,
    sameSite: config.cookie.sameSite as 'lax' | 'strict' | 'none' | undefined,
    maxAge: 0, // Set to 0 to delete the cookie immediately
  });

  // console.log(`Cookie '${config.cookie.name}' removed.`);
  // Optionally, you can also clear the session data on the server side if needed
}