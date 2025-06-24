import { AtpAgent } from '@atproto/api'
import fs from 'fs/promises'
import 'dotenv/config'
import path from 'path'

console.log('Publishing lexicon...')

const handle = process.env.ATPROTO_USERNAME
const password = process.env.ATPROTO_PASSWORD
const lexiconDir = './lexicon'

// load the lexicon directory
const lexiconDocs = await loadLexicon(lexiconDir)

// create an authenticated agent
const authd = new AtpAgent({
  service: 'https://bsky.social',
})
await authd.login({
  identifier: handle,
  password: password,
})

// publish each lexicon
for (const lexicon of lexiconDocs) {
  console.log(`Publishing: ${lexicon.id}`)
  try {
    await writeLexicon(lexicon)
    // console.log(`Successfully published lexicon: ${lexicon.id}`)
  } catch (error) {
    console.error(`Error: ${lexicon.id}`, error)
  }
}

// helper functions
async function loadLexicon(dir: string) {
  const lexicons: any[] = []

  async function walk(directory: string) {
    const files = await fs.readdir(directory)

    for (const file of files) {
      const filePath = path.join(directory, file)
      const stat = await fs.stat(filePath)

      if (stat.isDirectory()) {
        await walk(filePath) // Recursive call for subdirectories
      } else if (file.endsWith('.json')) {
        try {
          const fileContent = await fs.readFile(filePath, 'utf-8')
          const lexicon = JSON.parse(fileContent)
          lexicons.push(lexicon)
          // console.log(`Loaded lexicon: ${lexicon.id} from ${filePath}`)
        } catch (error) {
          console.error(`Error parsing lexicon file ${filePath}:`, error)
        }
      }
    }
  }

  await walk(dir)
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
