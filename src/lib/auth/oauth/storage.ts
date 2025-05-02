import type {
  NodeSavedSession,
  NodeSavedSessionStore,
  NodeSavedState,
  NodeSavedStateStore,
} from '@atproto/oauth-client-node'

import { Kysely } from 'kysely'
import { Database } from '../../../db/models'

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
    const session = JSON.stringify(val)
    const existing = await this.get(key)
    if (existing) {
      await this.del(key)
    }
    await this.db
      .insertInto("oauth_session")
      .values({ key, session })
      .returningAll()
      .executeTakeFirstOrThrow()
  }

  async del(key: string) {
    await this.db
      .deleteFrom("oauth_session")
      .where("key", "=", key)
      .returningAll()
      .executeTakeFirstOrThrow()
  }
}

