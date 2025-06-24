import { AtpAgent } from '@atproto/api'
import 'dotenv/config'
import * as fs from 'fs/promises'

const rkey = process.argv[2] || undefined
if (!rkey) {
  console.error('Usage: node delete-lexicon.js <rkey>')
  process.exit(1)
}

console.log('Deleting lexicon...', rkey)

const handle = process.env.ATPROTO_USERNAME
const password = process.env.ATPROTO_PASSWORD
const lexiconDir = './lexicon'

const authd = new AtpAgent({
  service: 'https://bsky.social',
})

const l = await authd.login({
  identifier: handle,
  password: password,
})

await authd.com.atproto.repo.deleteRecord({
  repo: handle,
  collection: "com.atproto.lexicon.schema",
  rkey,
})