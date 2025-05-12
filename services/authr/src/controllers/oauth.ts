import { type Context } from 'hono'
import { HTTPException } from 'hono/http-exception'

import { isValidHandle } from '@atproto/syntax'

import * as jose from 'jose';

import config from '@/config';

import { getClient } from "@/lib/auth/oauth/client";
import { addSession } from "@/lib/auth/session";
import { lookupInfo } from '@/lib/atproto/lookup';

// for saving some extra data
import { db } from '../../../authr/src/db/client';
import crypto from 'crypto';

// GET
export const clientMetadata = async (c: Context) => {
  return c.json((await getClient()).clientMetadata);
};

// GET
export const jwks = async (c: Context) => {
  return c.json((await getClient()).jwks);
};

// POST
export const login = async (c: Context) => {

  // Input data & defaults
  const data = await c.req.json()
  if (!data.redirect) {
    data.redirect = config.oauth.defaultRedirect
  }

  // Validate
  const handle = data.handle
  if (typeof handle !== 'string' || !isValidHandle(handle)) {
    throw new HTTPException(400, { message: 'invalid handle' })
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

  // get did from handle now that we have a step.1 authorized user
  const info = await lookupInfo(handle)

  // upsert user, set redirect
  const userinfo = await db.selectFrom("oauth_userinfo")
    .where("key", "=", info.did)
    .selectAll()
    .executeTakeFirst()

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
    throw new HTTPException(500, { message: 'Internal Server Error' })
  }

  // Redirect to Bluesky / PDS
  const ret = { redirect: url.toString() }

  // should we return the url here?
  // this login endpoint is currently called from an async func based handler, not a post fetch
  return c.json(ret)
};

// GET
export const callback = async (c: Context) => {
  console.log("oauth.callback.query:", c.req.query())

  const at = await getClient()

  // let rawUrl = `${req.protocol}://${req.hostname}${req.originalUrl}`
  let parsedUrl = new URL(c.req.raw.url)
  let parsedQs = new URLSearchParams(parsedUrl.search || "");

  // Revoke any pending authentication requests if the connection is closed (optional)
  // HMMM, this causes an error
  // const ac = new AbortController()
  // req.on('close', () => ac.abort())

  let session: any = null
  try {
    const { session: atSession } = await at.callback(parsedQs /* are there more options here like authorize()? */)
    session = atSession
    console.log("callback.session:", session)
  } catch (error) {
    console.error("callback.error:", error)
  }

  const did = session.sub;
  // console.log("callback.sub:", did)

  // get redirect from DB
  const userinfo = await db.selectFrom("oauth_userinfo")
    .where("key", "=", did)
    .selectAll()
    .executeTakeFirst()

  console.log("callback.userinfo:", userinfo)

  // if we don't have a userinfo, something went wrong during the login flow
  if (!userinfo || !userinfo.key) {
    console.error("userinfo not found during callback, yikes!")
    throw new HTTPException(500, { message: 'Internal Server Error' })
  }

  const loc = userinfo.redirect || config.oauth.defaultRedirect

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
  await addSession(c, user)

  // todo, get the page based on query params

  c.res.headers.append('Location', loc)

  console.log("callback.res.headers.2:", c.res.headers)
  console.log("callback.redirect:", loc, userinfo.redirect, config.oauth.defaultRedirect)
  return c.redirect(loc, 303)

};

export const refresh = async (c: Context) => {
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
  // console.log("oauth.refresh.oauthSession:", oauthSession)

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

  // console.log("oauth.refresh.session:", session)

  res.status(200).json(session)
}


export const info = async (c: Context) => {
  // console.log("oauth.info.session:", req.session)

  const r = c.get('session')
  if (!r) {
    c.status(401)
    return c.json({ message: "Unauthorized" });
  }

  console.log("oauth.info.r:", r)

  const claims = jose.decodeJwt(r.access_token)
  console.log("oauth.info.claims:", claims)

  const session = {
    aud: r.aud,
    sub: r.sub,
    iss: r.iss, 
    token_type: r.token_type,
    scope: r.scope,
    access_issued_at: new Date(claims.iat as number * 1000).toISOString(),
    access_expires_at: new Date(claims.exp as number * 1000).toISOString(),
    refresh_expires_at: r.refresh_expires_at,
    access_token_hash: crypto.createHash('sha256').update(r.access_token).digest('hex'),
    refresh_token_hash: crypto.createHash('sha256').update(r.refresh_token).digest('hex'),
  }

  // console.log("oauth.info.session:", session)

  return c.json(session)

}