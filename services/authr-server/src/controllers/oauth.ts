import { Request, Response, NextFunction } from 'express';
import { isValidHandle } from '@atproto/syntax'

import * as jose from 'jose';

import config from '@/config';

import { getClient } from "@/lib/auth/oauth/client";
import { addSession } from "@/lib/auth/session";
import { lookupInfo } from '@/lib/atproto/lookup';

// for saving some extra data
import { db } from '../db/client';
import crypto from 'crypto';

// GET
export const clientMetadata = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json((await getClient()).clientMetadata);
  } catch (error) {
    next(error);
  }
};

// GET
export const jwks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json((await getClient()).jwks);
  } catch (error) {
    next(error);
  }
};

// POST
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await req.body
    // console.log("login.data:", data)

    if (!data.redirect) {
      data.redirect = config.oauth.defaultRedirect
    }


    // Validate
    const handle = data.handle
    if (typeof handle !== 'string' || !isValidHandle(handle)) {
      res.status(400).json({error: "invalid handle"})
    }

    // Revoke any pending authentication requests if the connection is closed (optional)
    // HMMM, this causes an error
    // const ac = new AbortController()
    // req.on('close', () => ac.abort())

    // Authorize
    const at = await getClient()
    const url = await at.authorize(handle, {
      // signal: ac.signal,
      scope: config.oauth.bskyScopes,
    })

    // console.log("login.url:", url)

    // get did from handle now that we have a step.1 authorized user
    const info = await lookupInfo(handle)

    // console.log("login.info:", info)

    //
    // upsert user, set redirect
    //
    const userinfo = await db.selectFrom("oauth_userinfo")
      .where("key", "=", info.did)
      .selectAll()
      .executeTakeFirst()

    // console.log("login.userinfo:", userinfo)

    try {

      if (!userinfo) {
        // create user
        await db
          .insertInto("oauth_userinfo")
          .values({
            key: info.did,
            redirect: data.redirect
          })
        .execute()

        // also need to create a user in the app view

      } else {
        // update userinfo
        await db
          .updateTable("oauth_userinfo")
          .set({
            // updated_at: new Date(),  // why is this not defined.... >:(
            redirect: data.redirect
          })
          .where("key", "=", info.did)
          .returningAll()
          .executeTakeFirst()
      }

    } catch (err: any) {
      console.error("login.db.error:", err)
      // res.status(500).json({error: "authr db error", details: err, message: err.message})
      throw err
    }

    // Redirect to Bluesky / PDS
    const ret = { redirect: url.toString() }
    // console.log("login.ret", ret)
    res.status(200).json(ret)

    // or return a redirect code with headers?
    //   can we catch that in the fetch in the react login component? 
    // res.status(303).set({ Location: url.toString() }).end()

  } catch (err: any) {
    res.status(400).json({error: "oauth authorize failed", details: err, message: err.message})
    // or should we wrap the error and call next()?
  }
};

// GET
export const callback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const at = await getClient()

    let rawUrl = `${req.protocol}://${req.hostname}${req.originalUrl}`
    let parsedUrl = new URL(rawUrl)
    let parsedQs = new URLSearchParams(parsedUrl.search || "");

    // Revoke any pending authentication requests if the connection is closed (optional)
    // HMMM, this causes an error
    // const ac = new AbortController()
    // req.on('close', () => ac.abort())

    const { session } = await at.callback(parsedQs /* are there more options here like authorize()? */)
    // console.log("callback.session:", session)

    const did = session.sub;
    // console.log("callback.sub:", did)

    // get redirect from DB
    const userinfo = await db.selectFrom("oauth_userinfo")
      .where("key", "=", did)
      .selectAll()
      .executeTakeFirst()

    // if we don't have a userinfo, something went wrong during the login flow
    if (!userinfo || !userinfo.key) {
      res.status(500).json({error: "userinfo not found", details: "userinfo not found during callback, yikes!"})
      // or next(new Error("userinfo not found"))?
      return
    }

    const loc = userinfo.redirect || config.oauth.defaultRedirect
    // console.log("callback.redirect:", loc, userinfo.redirect, config.defaultRedirect)

    // do we want to duplicate this info in the authr db?
    //   we'd have to make sure to update it if it changes, the at-mirror should be doing that already
    const info: any = await lookupInfo(did)

    // lookup existing session info for the did+device

    // data to save in session
    const user = {
      did: session.did,
      handle: info.handle,
      pds: info.pds,
    }
    // console.log("callback.user:", user)

    // prepare session & response
    await addSession(req, res, user)

    // todo, get the page based on query params
    res
      .set({ 
        'Location': loc,
      })

    // console.log("callback.res.headers.2:", res.getHeaders())
    res
      .status(303).json({
      status: "ok"
    })
    
  } catch (err: any) {
    res.status(400).json({error: "oauth authorize failed", details: err, message: err.message})
  }

};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  // ...
  console.log("oauth.refresh.query:", req.query)

  if (!req.query.did) {
    return res.status(400).json({ message: "Missing did" });
  }
  var did = req.query.did
  // var force = req.query.force

  // validation

  // do we have a session, and is the session the same as the did?
  let authd = false
  if (req.session && req.session.did === did) {
    authd = true
  } else if (req.headers['x-apikey'] && req.headers['x-apikey'] === config.webhook.secret) {
    authd = true
    // check for api key
    if (!req.query.did) {
      return res.status(400).json({ message: "Missing did" });
    }
  }

  if (!authd) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // try to restore the session
  const client = await getClient()
  const oauthSession = await client.restore(did as string, true)
  console.log("sessionHandler.oauthSession:", oauthSession)

  // get the latest oauth session from the database
  const r = await db.selectFrom("oauth_session")
    .where("key", "=", req.query.did as string)
    .selectAll()
    .executeTakeFirst()
  const session = {
    aud: r?.aud,
    sub: r?.sub,
    iss: r?.iss, 
    token_type: r?.token_type,
    access_token: r?.access_token,
    refresh_token: r?.refresh_token,
    expires_at: r?.expires_at,
    scope: r?.scope,
  }

  console.log("oauth.refresh.session:", session)

  res.status(200).json(session)
}


export const info = async (req: Request, res: Response, next: NextFunction) => {
  console.log("oauth.info.session:", req.session)

  if (!req.session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const r = req.session

  const claims = jose.decodeJwt(r.access_token)
  console.log(claims)

  const session = {
    aud: r.aud,
    sub: r.sub,
    iss: r.iss, 
    token_type: r.token_type,
    scope: r.scope,
    access_issued_at: claims.iat,
    access_expires_at: claims.exp,
    refresh_expires_at: r.expires_at,
    access_token_hash: crypto.createHash('sha256').update(r.access_token).digest('hex'),
    refresh_token_hash: crypto.createHash('sha256').update(r.refresh_token).digest('hex'),
  }

  console.log("oauth.info.session:", session)

  res.status(200).json(session)

}