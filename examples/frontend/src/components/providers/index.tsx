"use client"

import CookieProvider from './cookies'
// import ThemeProvider from "./theme";
import QueryProvider from "./query";

import { AuthrProvider } from '@/components/context/authr';

const Providers = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <CookieProvider>
      {/* <ThemeProvider 
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      > */}
      <AuthrProvider>
        <QueryProvider>
          {children}
        </QueryProvider>
      </AuthrProvider>
      {/* </ThemeProvider> */}
    </CookieProvider>
  )
}

export default Providers;
