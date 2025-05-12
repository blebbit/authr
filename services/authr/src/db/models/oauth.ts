import {
  type ColumnType,
  type Generated,
} from 'kysely'


// extra info we need to connect things across
// 1. oauth login flow
// 2. servers / sessions / cookies
// 3. humans / accounts / devices
export interface OauthUserInfoTable {
  key: string
  created_at: ColumnType<Date, string | undefined, never>
  updated_at: ColumnType<Date, string | undefined, never>
  redirect: string | null
}

// kept while user is logged in
export interface OauthSessionTable {
  key: string
  created_at: ColumnType<Date, string | undefined, never>
  updated_at: ColumnType<Date, string | undefined, never>
  session: string
  iss: string
  aud: string
  sub: string
  scope: string
  token_type: string
  access_token: string
  refresh_token: string
  access_expires_at: ColumnType<Date, string | undefined, never>
  refresh_expires_at: ColumnType<Date, string | undefined, never>
}

// used during oauth login
export interface OauthStateTable {
  key: string
  created_at: ColumnType<Date, string | undefined, never>
  updated_at: ColumnType<Date, string | undefined, never>
  state: string
}

// blebbit auth table, where we manage multiple devices and accounts
export interface AuthrSessionTable {
  id: Generated<string> // uuid
  key: string // did
  created_at: ColumnType<Date, string | undefined, never>
  updated_at: ColumnType<Date, string | undefined, never>
  // expiers_at: ColumnType<Date, string | undefined, never> // should be optional, how to do this in Kysely?
  device_id: string
  device_name: string
  session_id: string

  // tokens and expriations
}