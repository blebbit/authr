import { JWK } from 'ts-jose';

const name = process.argv.slice(2)[0]

// generate key
JWK.generate('ES256', {
  kid: name,
  use: 'sig',
  // crv: string, some algorithms need to add curve - EdDSA
  // modulusLength: number, some algorithms need to add length - RSA
}).then((key) => {
  console.log(JSON.stringify(key.metadata))
});