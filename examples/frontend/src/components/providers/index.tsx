"use client"

// import ThemeProvider from "./theme";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthrProvider, CookieProvider } from '@blebbit/authr-react';

const queryClient = new QueryClient();

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
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </AuthrProvider>
      {/* </ThemeProvider> */}
    </CookieProvider>
  )
}

export default Providers;
