import type {
  NodeSavedSession,
  NodeSavedSessionStore,
  NodeSavedState,
  NodeSavedStateStore,
} from '@/lib/atproto/oauth-client-node'
import { JoseKey } from '@atproto/jwk-jose'
import * as jose from 'jose'

import { type Database } from '@/db/models'
import { Kysely } from 'kysely'

import { sendEvent } from '@/lib/events'

export class StateStore implements NodeSavedStateStore {
  constructor(private db: Kysely<Database>) {}

  async get(key: string): Promise<NodeSavedState | undefined> {
    const result = await this.db
      .selectFrom("oauth_state")
      .where("key", "=", key)
      .selectAll()
      .executeTakeFirst()

    if (!result) return
    return JSON.parse(result.state) as NodeSavedState
  }

  async set(key: string, val: NodeSavedState) {
    const state = JSON.stringify(val)
    await this.db
      .insertInto("oauth_state")
      .values({ key, state })
      .returningAll()
      .executeTakeFirstOrThrow()
  }

  async del(key: string) {
    await this.db
      .deleteFrom("oauth_state")
      .where("key", "=", key)
      .returningAll()
      .executeTakeFirstOrThrow()
  }
}

export class SessionStore implements NodeSavedSessionStore {
  constructor(private db: Kysely<Database>) {}

  async get(key: string): Promise<NodeSavedSession | undefined> {
    const result = await this.db
      .selectFrom("oauth_session")
      .where("key", "=", key)
      .selectAll()
      .executeTakeFirst()

    if (!result) return
    return JSON.parse(result.session) as NodeSavedSession
  }

  async set(key: string, val: NodeSavedSession) {
    console.log("SessionStore.set", key)

    const claims = jose.decodeJwt(val.tokenSet.access_token)
    // console.log("SessionStore.set.claims:", claims);

    // try {
    //   // TODO, need to get this from the PDS / oauth provider
    //   // or check that the atagent is doing this already

    //   const bskyPubKey = await JoseKey.fromImportable('{"kty":"EC","alg":"ES256K","use":"sig","crv":"secp256k1","x":"GgskXhf9OJFxYNovWiwq35akQopFXS6Tzuv0Y-B6q8I","y":"Cv8TnJVvra7TmYsaO-_nwhpD2jpfdnRE_TAeuvxLgJE"}')
    //   const validateResp = await bskyPubKey.verifyJwt(val.tokenSet.access_token as any)
    //   // console.log("SessionStore.bskyPubKey", bskyPubKey)
    //   console.log("SessionStore.validateResp", validateResp)
    // } catch (error) {
    //   console.error("SessionStore.bskyPubKey error", error)
    // }

    const session = JSON.stringify(val)

    // do we want to delete this or just overwrite it?
    const existing = await this.get(key)
    if (existing) {
      await this.del(key)
    }

    const data: any = {
      key,
      session,
      iss: val.tokenSet.iss,
      aud: val.tokenSet.aud,
      sub: val.tokenSet.sub,
      scope: val.tokenSet.scope,
      token_type: val.tokenSet.token_type,
      access_token: val.tokenSet.access_token,
      refresh_token: val.tokenSet.refresh_token,
      access_expires_at: new Date(claims.exp as number).toISOString(),
      refresh_expires_at: val.tokenSet.expires_at
    }

    // TODO // add something for atproto vs google vs ... (to the table schema, write an atproto default here)
    await this.db
      .insertInto("oauth_session")
      .values(data)
      .returningAll()
      .executeTakeFirstOrThrow()

    // console.log("SessionStore.event", key)

    try {
      // send webhook event
      await sendEvent("oauth_session.set", data)
    } catch (error) {
      console.error("Error sending event:", error)
    }
  }

  async del(key: string) {
    // console.log("SessionStore.del", key)
    await this.db
      .deleteFrom("oauth_session")
      .where("key", "=", key)
      .returningAll()
      .executeTakeFirstOrThrow()

    // TODO, call agent.logout() here?

    // apparently there is both a delete and an add on session refresh
    //   which could get out of sync at the other end
    //   so we rely on last write and (todo) KV TTL to clean up
    //   the tokens will expire if deleted here or would be invalid everywhere if revoked (actually worked)
    // try {
    //   // send webhook event
    //   await sendEvent("oauth_session.del", {
    //     key,
    //   })
    // } catch (error) {
    //   console.error("Error sending event:", error)
    // }
  }
}

