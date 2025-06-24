import { Context } from 'hono'
import { getCookie } from 'hono/cookie'

import { getConfig } from '../config'

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
