import { AtpAgent } from '@atproto/api'
import fs from 'fs/promises'
import 'dotenv/config'

console.log('Publishing lexicon...')

const handle = process.env.ATPROTO_USERNAME
const password = process.env.ATPROTO_PASSWORD
const lexiconDir = './lexicon'

const lexiconDocs = await loadLexicon(lexiconDir)

const authd = new AtpAgent({
  service: 'https://bsky.social',
})

const l = await authd.login({
  identifier: handle,
  password: password,
})

for (const lexicon of lexiconDocs) {
  console.log(`Publishing: ${lexicon.id}`)
  try {
    await writeLexicon(lexicon)
    // console.log(`Successfully published lexicon: ${lexicon.id}`)
  } catch (error) {
    console.error(`Error: ${lexicon.id}`, error)
  }
}

async function loadLexicon(dir: string) {
  const lexiconFiles = await fs.readdir(dir)
  console.log(lexiconFiles)
  const lexicons = await Promise.all(
    lexiconFiles.map(async (file) => {
      const filePath = `${lexiconDir}/${file}`
      const fileContent = await fs.readFile(filePath, 'utf-8')
      return JSON.parse(fileContent)
    }),
  )
  return lexicons
}

async function writeLexicon(lexicon: any) {
  return await authd.com.atproto.repo.putRecord({
    repo: handle,
    collection: "com.atproto.lexicon.schema",
    record: lexicon,
    rkey: lexicon.id,
  })
}