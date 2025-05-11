import { Request, Response, NextFunction } from 'express';
import { Agent } from '@atproto/api';
import { TokenRefreshError } from '@atproto/oauth-client';

import { getClient } from "../lib/auth/oauth/client";
import { getSession, addSession } from "../lib/auth/session";

import { db } from '../db/client';

export const sessionHandler = async (req: Request, res: Response, next: NextFunction) => {
  console.log("sessionHandler.req.path:", req.path)
  let authrSession = null

  try {
    // get the blebbit session from the cookie
    authrSession = await getSession(req);
    console.log("sessionHandler.authrSession:", authrSession)
  } catch (error) {
    if (error.claim === 'exp' && error.code === 'ERR_JWT_EXPIRED') {
      console.error("Authr cookie expired...:", error)

      authrSession = await addSession(req, res, {
        did: error.payload.did,
        pds: error.payload.pds,
        handle: error.payload.handle,
      });

    } else {
      console.error("Error getting session:", error)
    }
  }

  // lookup in database or cache (?)
  if (authrSession) {

    // check for expired session
    if (new Date(authrSession.exp) > new Date()) {
      console.log("sessionHandler.sessionExpired:", authrSession.exp)
      return res.status(401).json({
        error: "Session expired",
        message: "Session expired",
        status: 401,
      })
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
        res.redirect(url)
      }
      console.error("sessionHandler.restore.error:", error)
    }

    // if no oauthSession, nothing to do
    if (!oauthSession) {
      next()
    }

    const agent = new Agent(oauthSession)
    req.agent = agent
    req.client = client

    // get the latest oauth session from the database
    const r = await db.selectFrom("oauth_session")
      .where("key", "=", authrSession.did)
      .selectAll()
      .executeTakeFirst()
    req.session = {
      ...authrSession,
      aud: r?.aud,
      sub: r?.sub,
      iss: r?.iss, 
      token_type: r?.token_type,
      access_token: r?.access_token, // we also want to make xrpc requests by hand, not just through the agent
      refresh_token: r?.refresh_token,
      expires_at: r?.expires_at,
      scope: r?.scope,
    }

  }

  next()
}