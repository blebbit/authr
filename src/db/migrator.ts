import * as path from 'path'
import { promises as fs } from 'fs'
import {
  Migrator,
  FileMigrationProvider,
} from 'kysely'

import { db } from './client'

export async function migrateToLatest() {
  console.log("database.migrate.begin")
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      // This needs to be an absolute path.
      migrationFolder: path.join(__dirname, 'migrations'),
    }),
  })

  console.log("database.migrate.start")
  const { error, results } = await migrator.migrateToLatest()
  console.log("database.migrate.results")

  if (error) {
    console.error('failed to migrate')
    console.error(error)
  }

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed successfully`)
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`)
    }
  })

  if (error) {
    process.exit(1)
  }

  console.log("database.migrate.ending")
}