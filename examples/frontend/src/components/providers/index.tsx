"use client"

// import ThemeProvider from "./theme";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type AuthrOptions, AuthrProvider, CookieProvider } from '@blebbit/authr-react';

const queryClient = new QueryClient();

const options: AuthrOptions = {
  cookieName: import.meta.env.VITE_AUTHR_COOKIE_NAME as string,
  cookieDomain: import.meta.env.VITE_AUTHR_COOKIE_DOMAIN as string,
}


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
      <AuthrProvider options={options}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </AuthrProvider>
      {/* </ThemeProvider> */}
    </CookieProvider>
  )
}

export default Providers;
