import { Request, Response, NextFunction } from 'express';
import { Agent } from '@atproto/api';

import { getClient } from "../lib/auth/oauth/client";
import { getSession } from "../lib/auth/session";

import { db } from '../db/client';

export const sessionHandler = async (req: Request, res: Response, next: NextFunction) => {

  // get the blebbit session from the cookie
  const session = await getSession(req);

  console.log("sessionHandler.session:", session)

  // lookup in database or cache (?)
  if (session) {

    // setup Agent for the oauth session tied to the blebbit session
    const client = await getClient()
    const oauthSession = await client.restore(session.did)
    // console.log("sessionHandler.oauthSession:", oauthSession)
    const agent = new Agent(oauthSession)
    req.agent = agent
    req.client = client

    // get the latest oauth session from the database
    const r = await db.selectFrom("oauth_session")
      .where("key", "=", session.did)
      .selectAll()
      .executeTakeFirst()
    req.session = {
      ...session,
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