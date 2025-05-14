"use client"

import { useLocalStorage } from "@uidotdev/usehooks";
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useAuthr } from "@blebbit/authr-react";

export const AccountSwitcher = () => {
  const queryClient = useQueryClient()
  const [sessions] = useLocalStorage("blebbit/sessions", { accounts: [], current: {} as any });
  const { switchAccount: authrSwitchAccount } = useAuthr()

  const switchAccount = useMutation({
    mutationFn: (did: string) => {
      authrSwitchAccount(did)
      return null
    },
    onSuccess: (_, did: string) => {
      console.log("invalidating queries", did, 'oauthInfo')
      queryClient.invalidateQueries({ queryKey: [did, 'oauthInfo'], })
      queryClient.invalidateQueries({ queryKey: [did, 'bskyProfile'], })
      queryClient.invalidateQueries({ queryKey: [did, 'bskyPreferences'], })
    },
  })

  return (
    <div className="flex gap-4 m-2 items-center">
      <span>Switch Account: </span>
      { sessions.accounts.map((s: any) => {
        return (
          <div key={s.did}>
            <h3
              className="border rounded-md py-1 px-2 cursor-pointer hover:bg-gray-200"
              onClick={() => switchAccount.mutate(s.did)}
            >@{s.handle}</h3>
          </div>
        )
      }
      )}
    </div>
  )
}