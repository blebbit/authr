import { type Database } from './models/index.js' // this is the Database interface we defined earlier
import { Pool } from 'pg'
import { Kysely, PostgresDialect } from 'kysely'

import config from '@/config'

const dialect = new PostgresDialect({
  pool: new Pool({
    database: config.db.database,
    ssl: config.db.ssl,
    password: config.db.password,
    host: config.db.host,
    user: config.db.user,
    port: config.db.port,
    max: config.db.maxConnections,
  })
})

// Database interface is passed to Kysely's constructor, and from now on, Kysely 
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how 
// to communicate with your database.
export const db = new Kysely<Database>({
  dialect,
})