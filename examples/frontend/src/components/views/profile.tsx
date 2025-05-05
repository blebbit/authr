import { useQuery } from "@tanstack/react-query"
import { useCookies } from 'react-cookie';
import { useLocalStorage } from "@uidotdev/usehooks";

const ProfileView = ({session}: {session: any}) => {
  const [sessions, setSessions] = useLocalStorage("blebbit/sessions", { accounts: [], current: { did: "" } });
  const [_, setCookie] = useCookies()


  const bskyProfile = useQuery({
    queryKey: [session?.handle, 'bskyProfile'],
    queryFn: async () => {

      const r = await fetch(`${import.meta.env.VITE_XRPC_HOST}/xrpc/com.atproto.repo.getRecord?repo=${session?.did}&collection=app.bsky.actor.profile&rkey=self`, {
        credentials: 'include'
      })

      return r.json()
    },
    enabled: !!(session?.did)
  })

  // TODO, we need to improve the xrpc proxy handler to support the different path and param style, also json payloads for POSTs
  // const bskyPreferences = useQuery({
  //   queryKey: [session?.handle, 'bskyPrefs'],
  //   queryFn: async () => {

  //     const r = await fetch(`${import.meta.env.VITE_AUTHR_OAUTH_HOST}/xrpc/${session?.did}/app.bsky.actor.getPreferences`)
  //     return r.json()
  //   },
  //   enabled: !!(session?.did)
  // })

  const switchAccount = (did: string) => {
    console.log("switchAccount", did)
    for (const s in sessions.accounts) {
      if (sessions.accounts[s].did === did) {
        sessions.current = sessions.accounts[s]
        const cookieName = import.meta.env.VITE_AUTHR_COOKIE_NAME as string
        setCookie(cookieName, sessions.current.cookie, {
          path: '/',
          domain: import.meta.env.VITE_AUTHR_COOKIE_DOMAIN,
          sameSite: 'lax', 
        })
        break
      }
    }
    setSessions(sessions)
  }

  return (
    <div>
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
      {/* <pre>
        {bskyPreferences.data ? JSON.stringify(bskyPreferences.data, null, 2) : null }
      </pre> */}
      <pre>
        {bskyProfile.data ? JSON.stringify(bskyProfile.data, null, 2) : null }
      </pre>
    </div>
  );
}

export default ProfileView;
