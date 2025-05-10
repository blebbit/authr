"use client"

import {
  createContext,
  useContext,
} from "react";

import { useCookies } from 'react-cookie';
import { useLocalStorage } from "@uidotdev/usehooks";

import * as jose from 'jose';

interface AuthrContextInterface {
  session: any;
}

const AuthrContext = createContext<AuthrContextInterface | undefined>(undefined);

export const useAuthrContext = () => {
  const context = useContext(AuthrContext);
  if (context === undefined) {
    throw new Error("useAuthrContext must be used within a AuthrProvider");
  }
  return context;
};

export default AuthrContext;

export const AuthrProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  // hooks
  const [sessions, setSessions] = useLocalStorage("blebbit/sessions", { accounts: [], current: { did: "" } });
  const [cookies] = useCookies()
  

  // console.log("AuthrProvider.sessions.pre", sessions)
  console.log("AuthrProvider.cookies", cookies)

  // handle cookie
  const cookieName = import.meta.env.VITE_AUTHR_COOKIE_NAME as string
  console.log("AuthrProvider cookieName", cookieName)
  const ba = cookies[cookieName]
  var claims: any = undefined
  if (ba) {
    claims = jose.decodeJwt(ba || "")
  }

  // handle session
  const session = {
    cookie: ba,
    ...claims,
  }
  console.log("AuthrProvider.session", session)
  console.log("AuthrProvider.sessions.pre", sessions)

  let found = false
  for (const s in sessions.accounts) {
    if (session.did === sessions.accounts[s].did) {
      sessions.accounts[s] = session
      found = true
      break
    }
  }
  if (!found && session.did) {
    sessions.accounts.push(session)
  }
  sessions.current = session
  setSessions(sessions)
  console.log("AuthrProvider.sessions.post", sessions)

  // Build up final context object
  const contextValue = {
    session,
  }
  console.log("AuthrContext.value", contextValue)

  return (
    <AuthrContext.Provider value={contextValue}>
      {children}
    </AuthrContext.Provider>
  );
};
