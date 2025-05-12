import { type Context, type Next } from 'hono';
import { HTTPException } from 'hono/http-exception'

import { Agent } from '@atproto/api';
import { TokenRefreshError } from '@atproto/oauth-client';

import { getClient } from "@/lib/auth/oauth/client";
import { getSession, addSession } from "@/lib/auth/session";

import { db } from '@/db/client';

export default async (c: Context, next: Next) => {

  if (c.req.path === '/oauth/callback') {
    // skip this middleware for the authorize endpoint
    await next()
    return
  }

  let authrSession = null

  try {
    // get the blebbit session from the cookie
    authrSession = await getSession(c);
  } catch (error) {
    if (error.claim === 'exp' && error.code === 'ERR_JWT_EXPIRED') {
      console.error("Authr cookie expired...:", error)

      authrSession = await addSession(c, {
        did: error.payload.did,
        pds: error.payload.pds,
        handle: error.payload.handle,
      });

    } else {
      console.error("Error getting session:", error)
    }
  }

  console.log("sessionHandler:", c.req.path, authrSession?.did)

  // lookup in database or cache (?)
  if (authrSession) {

    // check for expired session
    if (new Date(authrSession.exp) > new Date()) {
      console.log("sessionHandler.sessionExpired:", authrSession.exp)
      throw new HTTPException(401, { message: 'Session expired' })
    }

    // setup Agent for the oauth session tied to the blebbit session
    const client = await getClient()
    let oauthSession = null

    try {
      oauthSession = await client.restore(authrSession.did)
      // console.log("sessionHandler.oauthSession:", oauthSession)
    }
    catch (error) {
      if (error instanceof TokenRefreshError) {
        console.error("sessionHandler.tokenRefreshError:", error)
        const url = await client.authorize(authrSession.handle, {
          prompt: 'none',

          // Build an internal state to map the login request to the user, and allow retries
          // state: JSON.stringify({
          //   user,
          //   handle,
          //   redirect,
          // }),
        })
        // return c.redirect(url)
      }
      console.error("sessionHandler.restore.error:", error)
    }

    // if no oauthSession, nothing to do
    if (!oauthSession) {
      await next()
      return
    }

    const agent = new Agent(oauthSession)
    c.set('agent', agent)
    c.set('client', client)

    // get the latest oauth session from the database
    const r = await db.selectFrom("oauth_session")
      .where("key", "=", authrSession.did)
      .selectAll()
      .executeTakeFirst()
    c.set('session', {
      ...authrSession,
      ...r,
    })
  }

  // console.log("sessionHandler.next:")
  await next()
}