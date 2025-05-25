"use client"

// import ThemeProvider from "./theme";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type AuthrOptions, AuthrProvider, CookieProvider } from '@blebbit/authr-react-tanstack';

const queryClient = new QueryClient();

const options: AuthrOptions = {
  cookieName: import.meta.env.VITE_AUTHR_COOKIE_NAME as string,
  cookieDomain: import.meta.env.VITE_AUTHR_COOKIE_DOMAIN as string,
  oauthHost: import.meta.env.VITE_AUTHR_OAUTH_HOST as string,
}

// const ThemeProvider = ({
//   children,
// }: {
//   children: React.ReactNode
// }) => {
//   return (
//     <ThemeProvider>
//       {children}
//     </ThemeProvider>
//   )
// }

const Providers = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <CookieProvider>
      {/* <ThemeProvider> */}
        <QueryClientProvider client={queryClient}>
          <AuthrProvider options={options}>
            {children}
          </AuthrProvider>
        </QueryClientProvider>
      {/* </ThemeProvider> */}
    </CookieProvider>
  )
}

export default Providers;
