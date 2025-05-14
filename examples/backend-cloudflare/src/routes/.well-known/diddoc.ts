import { type Context } from 'hono';
import { P256Keypair, Secp256k1Keypair } from '@atproto/crypto'
import {
  fromString as ui8FromString,
  toString as ui8ToString,
} from 'uint8arrays'

var doc = {
  "@context": [
    'https://www.w3.org/ns/did/v1',
    'https://w3id.org/security/multikey/v1',
  ],
  "id": "did:web:api.authr.blebbit.dev",
  "verificationMethod": [
    {
      "id": "did:web:api.authr.blebbit.dev#atproto",
      "type": "Multikey",
      "controller": "did:web:api.authr.blebbit.dev",
      "publicKeyMultibase": "...?"
    }
  ],
  "service": [
    {
      "id": "#authr_appview",
      "type": "AuthrAppView",
      "serviceEndpoint": "https://api.authr.blebbit.dev"
    }
  ]
}

var serviceKeypair: Secp256k1Keypair | P256Keypair

async function initKeyAndDoc(c: Context) {
  const privateKeyHex = c.env.ATPROTO_SERVICE_PRVKEY
  serviceKeypair = await P256Keypair.import(privateKeyHex, {
    exportable: true,
  })
  // console.log('Revived DID:', serviceKeypair.did())
  // console.log('Revived Public Key:', serviceKeypair.publicKeyStr('base64pad'))
  // console.log('Revived Private Key:', await serviceKeypair.export())

  doc["id"] = `did:web:${c.env.ATPROTO_SERVICE_DOMAIN}`
  doc["verificationMethod"][0]["id"] = `did:web:${c.env.ATPROTO_SERVICE_DOMAIN}#atproto`
  doc["verificationMethod"][0]["controller"] = `did:web:${c.env.ATPROTO_SERVICE_DOMAIN}`
  doc["verificationMethod"][0]["publicKeyMultibase"] = serviceKeypair.did().replace('did:key:', '')
  doc["service"][0]["serviceEndpoint"] = `https://${c.env.ATPROTO_SERVICE_DOMAIN}` // localhost?
}


export async function getDidDoc(c: Context) { 
  if (!serviceKeypair) {
    await initKeyAndDoc(c)
  }

  return c.json(doc)
}