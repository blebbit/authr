import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {

  // OAuth State (used during oauth login workflow)
  await db.schema
    .createTable('oauth_state')
    .addColumn('key', 'varchar', (col) => col.primaryKey())
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('updated_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('state', 'varchar', (col) => col.notNull())
    .execute()

  
  // OAuth Sessions (should support multiple accounts and multiple devices)
  await db.schema
    .createTable('oauth_session')
    .addColumn('key', 'varchar', (col) => col.primaryKey())
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('updated_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('session', 'varchar', (col) => col.notNull())
    .addColumn('iss', 'varchar')
    .addColumn('aud', 'varchar')
    .addColumn('sub', 'varchar')
    .addColumn('scope', 'varchar')
    .addColumn('token_type', 'varchar')
    .addColumn('access_token', 'varchar')
    .addColumn('refresh_token', 'varchar')
    .addColumn('access_expires_at', 'timestamp')
    .addColumn('refresh_expires_at', 'timestamp')
    .execute()

  // so we can quickly find sessions nearing expiration
  await db.schema
    .createIndex('oauth_session_access_expires_at_index')
    .on('oauth_session')
    .column('access_expires_at')
    .execute()
  await db.schema
    .createIndex('oauth_session_refresh_expires_at_index')
    .on('oauth_session')
    .column('refresh_expires_at')
    .execute()

  // extra user info, per DID, typically used to persist information during the oauth login flow
  //   but could also last for the lifetime of the account
  await db.schema
    .createTable('oauth_userinfo')
    .addColumn('key', 'varchar', (col) => col.primaryKey())
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('updated_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('redirect', 'varchar', (col) => col.notNull())
    .execute()

  // HMMM, index on device_id?

  // Table to store the authr sessions for account and device management
  await db.schema
    .createTable('authr_session')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`)) // match on this
    .addColumn('key', 'varchar', (col) => col.notNull())  // did
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('updated_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())

    // for now our authr sessions are infinite
    //   while the underlying oauth session needs a periodic refresh
    // .addColumn('expires_at', 'timestamp')

    // extra info about the session
    .addColumn('device_id', 'uuid', (col) => col.defaultTo(sql`gen_random_uuid()`).notNull()) // uuid of the device
    .addColumn('device_name', 'varchar')

    .execute()

  // HMMM, index on device_id?

  await db.schema
    .createIndex('authr_session_key_index')
    .on('authr_session')
    .column('key')
    .execute()

  // TODO, add table/columns for integrations and their kind (apikey vs oauth)
  //   will be connected via Keycloak, DEX, or similar
  //   right now, we only have one atproto per DID
  //   and have a sort of proxy with this table across devices
  //   these probably need to be a separate table, like oauth_session
  //   - scopes for integrations

  // HMMM, maybe atproto oauth can be handled by Keycloak or similar...?


}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('authr_session').execute()
  await db.schema.dropTable('oauth_userinfo').execute()
  await db.schema.dropTable('oauth_session').execute()
  await db.schema.dropTable('oauth_state').execute()
}