"use client"
import * as React from "react"

import { useCookies } from 'react-cookie';
import { useLocalStorage } from "@uidotdev/usehooks";

import * as jose from 'jose';

type AuthrContext = {
  session: any;
  sessions: any;
  switchAccount: (did: string) => void;
  // logout: (did: string) => void;
}

type AuthrOptions = {
  cookieName: string;
  cookieDomain: string;
}

type AuthrSession = {
  cookie?: string
  did: string
  pds: string
  handle: string
  sessionId?: string
}

type AuthrSessions = {
  current?: AuthrSession
  accounts: AuthrSession[]
}

const AuthrContext = React.createContext<AuthrContext | undefined>(undefined);

export const useAuthr = () => {
  const context = React.useContext(AuthrContext);
  if (context === undefined) {
    throw new Error("useAuthr must be used within a AuthrProvider");
  }
  return context;
};

export default AuthrContext;

export const AuthrProvider: React.FC<{ children: React.ReactNode }> = ({ children }: { children: React.ReactNode}) => {

  // hooks
  const [cookies, setCookies] = useCookies()
  const [sessions, setSessions] = useLocalStorage<AuthrSessions>("blebbit/sessions", { current: undefined, accounts: [] });
  
  const options: AuthrOptions = {
    cookieName: "authr_session",
    cookieDomain: ".blebbit.org",
  }

  // console.log("AuthrProvider.sessions.pre", sessions)
  console.log("AuthrProvider cookieName", options.cookieName)
  console.log("AuthrProvider.cookies.all", cookies)

  React.useEffect(() => { 
    // if we have an Authr cookie, lets see if we need to add it
    const authrCookie = cookies[options.cookieName]
    if (authrCookie) {
      const claims = jose.decodeJwt(authrCookie || "")

      // build session object
      const session: AuthrSession = {
        cookie: authrCookie,
        ...claims,
      }
      // console.log("AuthrProvider.session", session)
      // console.log("AuthrProvider.sessions.pre", sessions)

      // if we have a match, overwrite
      let found = false
      for (const s in sessions.accounts) {
        if (claims.did === sessions.accounts[s].did) {
          sessions.accounts[s] = session
          found = true
          break
        }
      }
      // if no match, new account
      if (!found && session.did) {
        sessions.accounts.push(session)
      }
      // always set current session
      sessions.current = session

      // finalize
      setSessions(sessions)
      console.log("AuthrProvider.sessions.post", sessions)
    }
  }, [cookies])

  // Build up final context object
  const contextValue = {
    session: sessions.current,
    sessions,
    switchAccount: (did: string) => {
      const newSession = sessions.accounts.find(s => s.did === did);
      if (newSession) {
        // this should trigger changing the current session
        // @not-ts-ignore (double check this)
        setCookies(options.cookieName, newSession.cookie, {
          path: '/',
          domain: options.cookieDomain,
          sameSite: 'lax', 
        });
      }
    }
  }
  console.log("AuthrContext.value", contextValue)

  return (
    <AuthrContext.Provider value={contextValue}>
      {children}
    </AuthrContext.Provider>
  );
};
