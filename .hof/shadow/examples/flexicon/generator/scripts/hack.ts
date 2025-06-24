import { AtpAgent } from '@atproto/api'
import 'dotenv/config'

import { xrpcCall } from '../sdk/client-ts/xrpc-call'

const did = process.env.ATPROTO_DID
const handle = process.env.ATPROTO_USERNAME
const password = process.env.ATPROTO_PASSWORD

console.log('DID:', did)
console.log('Handle:', handle)
console.log('Password:', password ? '***' : 'not set')

const authd = new AtpAgent({
  service: 'https://bsky.social',
})

await authd.login({
  identifier: handle,
  password: password,
})

const data = await xrpcCall(
  "https://mycena.us-west.host.bsky.network",
  'com.atproto.repo.getRecord',
  'GET',
  {
    repo: did,
    collection: 'com.atproto.lexicon.schema',
    rkey: 'app.blebbit.authr.group.defs'
  }
)

console.log('Lexicon data:', data)