import { P256Keypair, Secp256k1Keypair } from '@atproto/crypto'

import {
  fromString as ui8FromString,
  toString as ui8ToString,
} from 'uint8arrays'

(async () => {

  const keypair = await P256Keypair.create({ exportable: true })
  // const keypair = await Secp256k1Keypair.create({ exportable: true })

  const did = keypair.did()
  const publicKey = keypair.publicKeyStr('base64pad')
  const privateKey = await keypair.export()

  console.log('DID:', did)
  console.log('Public Key:', publicKey)
  console.log('Private Key:', privateKey)

  const privateKeyHex = ui8ToString(privateKey, 'hex')
  console.log("privateKeyHex:", privateKeyHex)
  console.log("pkhex.fromString:", ui8FromString(privateKeyHex, 'hex'))

  const revivedKeypair = await P256Keypair.import(privateKeyHex, {
  // const revivedKeypair = await Secp256k1Keypair.import(privateKeyHex, {
    exportable: true,
  })
  console.log('Revived DID:', revivedKeypair.did())
  console.log('Revived Public Key:', revivedKeypair.publicKeyStr('base64pad'))
  console.log('Revived Private Key:', await revivedKeypair.export())

})()