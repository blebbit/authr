import {
  OauthStateTable,
  OauthSessionTable,
  OauthUserInfoTable,
  AuthrSessionTable,
} from './oauth'

export interface Database {
  oauth_state:   OauthStateTable 
  oauth_session: OauthSessionTable 
  oauth_userinfo: OauthUserInfoTable
  authr_session: AuthrSessionTable
}