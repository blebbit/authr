import {
  type OauthStateTable,
  type OauthSessionTable,
  type OauthUserInfoTable,
  type AuthrSessionTable,
} from './oauth.js'

export interface Database {
  oauth_state:   OauthStateTable 
  oauth_session: OauthSessionTable 
  oauth_userinfo: OauthUserInfoTable
  authr_session: AuthrSessionTable
}