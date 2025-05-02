"use client"

import { useCookies } from 'react-cookie';
import {
  createContext,
  useContext,
} from "react";

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

  const [reCookiesStore] = useCookies()
  const cookieName = import.meta.env.VITE_AUTHR_COOKIE_NAME as string
  console.log("AuthrProvider cookieName", cookieName)
  const ba = reCookiesStore[cookieName]
  var claims: any = undefined
  if (ba) {
    claims = jose.decodeJwt(ba || "")
  }

  const value = {
    session: {
      did: claims?.did,
      handle: claims?.handle,
      pds: claims?.pds,
    },
  }

  console.log("AuthrContext value", value)

  return (
    <AuthrContext.Provider value={value}>
      {children}
    </AuthrContext.Provider>
  );
};
