import type {
  NodeSavedSession,
  NodeSavedSessionStore,
  NodeSavedState,
  NodeSavedStateStore,
} from '@atproto/oauth-client-node'

import { Kysely } from 'kysely'
import { Database } from '../../../db/models'
import { sendEvent } from '@/lib/events'
import { access } from 'fs'
import e from 'express'

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
    const session = JSON.stringify(val)

    // do we want to delete this or just overwrite it?
    const existing = await this.get(key)
    if (existing) {
      await this.del(key)
    }
    // TODO // add something for atproto vs google vs ... (to the table schema, write an atproto default here)
    await this.db
      .insertInto("oauth_session")
      .values({ key, session, ...val.tokenSet })
      .returningAll()
      .executeTakeFirstOrThrow()

    console.log("SessionStore.event", key)

    try {
      // send webhook event
      await sendEvent("oauth_session.set", {
        key,
        iss: val.tokenSet.iss,
        sub: val.tokenSet.sub,
        aud: val.tokenSet.aud,
        scope: val.tokenSet.scope,
        access_token: val.tokenSet.access_token,
        expires_at: val.tokenSet.expires_at,
      })
    } catch (error) {
      console.error("Error sending event:", error)
    }
  }

  async del(key: string) {
    await this.db
      .deleteFrom("oauth_session")
      .where("key", "=", key)
      .returningAll()
      .executeTakeFirstOrThrow()
  }
}

