// import { NodeOAuthClient } from '@atproto/oauth-client-node'
import { NodeOAuthClient } from '@/lib/atproto/oauth-client-node'
import { JoseKey } from '@atproto/jwk-jose'

import { SessionStore, StateStore } from './storage'

import { db } from '../../../db/client'
import config from '../../../config'

// for dynamic jwks.json
async function loadKeyset() {
  return Promise.all([
    JoseKey.fromImportable(config.oauth.jwks[0]),
    // JoseKey.fromImportable(config.oauth.jwks[1]),
    // JoseKey.fromImportable(process.env.PRIVATE_KEY_3),
  ])
}

// singleton client
var client: NodeOAuthClient | undefined = undefined 

export async function getClient() {
  // console.log("getClient.client:", client)
  // if we already have a client, return it
  if (client) {
    return client
  }

  // info about running server
  const url = config.oauth.publicUrl;
  const client_id = url + "/oauth/client-metadata.json";

  client = new NodeOAuthClient({
    // This object will be used to build the payload of the /client-metadata.json
    // endpoint metadata, exposing the client metadata to the OAuth server.
    clientMetadata: {
      client_name: config.oauth.clientName,
      client_id: client_id,
      client_uri: url,
      // logo_uri: url + '/logo.png',
      tos_uri: url + '/tos',
      policy_uri: url + '/policy',
      redirect_uris: [`${url}/oauth/callback`],
      scope: config.oauth.bskyScopes,
      grant_types: ['authorization_code', 'refresh_token'],
      response_types: ['code'],
      application_type: 'web',
      dpop_bound_access_tokens: true,

      // token_endpoint_auth_method: 'none',
      token_endpoint_auth_method: 'private_key_jwt',
      token_endpoint_auth_signing_alg: 'ES256',
      jwks_uri: url + '/oauth/jwks.json',
    },

    // stores for auth
    stateStore: new StateStore(db),
    sessionStore: new SessionStore(db),

    // Used to authenticate the client to the token endpoint. Will be used to
    // build the jwks object to be exposed on the "jwks_uri" endpoint.
    keyset: await loadKeyset(),

    // A lock to prevent concurrent access to the session store. Optional if only one instance is running.
    // requestLock,
  })

  return client
}