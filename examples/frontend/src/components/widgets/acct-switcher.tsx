"use client"
import { useCookies } from 'react-cookie';
import { useLocalStorage } from "@uidotdev/usehooks";
import { useQueryClient } from '@tanstack/react-query'
import { useAuthr } from "@blebbit/authr-react";

export const AccountSwitcher = () => {
  const queryClient = useQueryClient()
  const [sessions, setSessions] = useLocalStorage("blebbit/sessions", { accounts: [], current: {} as any });
  const [_, setCookie] = useCookies()
  const { switchAccount: authrSwitchAccount } = useAuthr()

  const switchAccount = (did: string) => {
    authrSwitchAccount(did)
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