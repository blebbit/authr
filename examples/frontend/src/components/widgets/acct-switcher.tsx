"use client"
import { useCookies } from 'react-cookie';
import { useLocalStorage } from "@uidotdev/usehooks";
import { useQueryClient } from '@tanstack/react-query'

export const AccountSwitcher = () => {
  const queryClient = useQueryClient()
  const [sessions, setSessions] = useLocalStorage("blebbit/sessions", { accounts: [], current: { did: "" } });
  const [_, setCookie] = useCookies()

  const switchAccount = (did: string) => {
    console.log("switchAccount", did)
    for (const s in sessions.accounts) {
      if (sessions.accounts[s].did === did) {
        sessions.current = sessions.accounts[s]
        const cookieName = import.meta.env.VITE_AUTHR_COOKIE_NAME as string
        // @ts-ignore
        setCookie(cookieName, sessions.current.cookie, {
          path: '/',
          domain: import.meta.env.VITE_AUTHR_COOKIE_DOMAIN,
          sameSite: 'lax', 
        })
        break
      }
    }
    setSessions(sessions)
    queryClient.invalidateQueries({
      queryKey: [sessions.current?.handle, 'oauthInfo'],
    })
    queryClient.invalidateQueries({
      queryKey: [sessions.current?.handle, 'bskyProfile'],
    })
    queryClient.invalidateQueries({
      queryKey: [sessions.current?.handle, 'bskyPreferences'],
    })
  }

  return (
    <div className="flex gap-4 m-2 items-center">
      <span>Switch Account: </span>
      { sessions.accounts.map((s: any) => {
        return (
          <div key={s.did}>
            <h3
              className="border rounded-md py-1 px-2 cursor-pointer hover:bg-gray-200"
              onClick={() => switchAccount(s.did)}
            >@{s.handle}</h3>
          </div>
        )
      }
      )}
    </div>
  )
}