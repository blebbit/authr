import { useQuery } from "@tanstack/react-query"
import { useCookies } from 'react-cookie';
import { useLocalStorage } from "@uidotdev/usehooks";

const ProfileView = ({session}: {session: any}) => {
  const [sessions, setSessions] = useLocalStorage("blebbit/sessions", { accounts: [], current: { did: "" } });
  const [_, setCookie] = useCookies()

  // const bskyProfile = useQuery({
  //   queryKey: [session?.handle, 'bskyProfile'],
  //   queryFn: async () => {

  //     const r = await fetch(`${import.meta.env.VITE_XRPC_HOST}/xrpc/com.atproto.repo.getRecord?repo=${session?.did}&collection=app.bsky.actor.profile&rkey=self`, {
  //       credentials: 'include'
  //     })

  //     return r.json()
  //   },
  //   enabled: !!(session?.did)
  // })

  const bskyProfile2 = useQuery({
    queryKey: [session?.handle, 'bskyProfile2'],
    queryFn: async () => {

      const r = await fetch(`${import.meta.env.VITE_XRPC_HOST}/xrpc/app.bsky.actor.getProfile?actor=${session?.did}`, {
        credentials: 'include',
        // headers: {
        //   'atproto-proxy': "did:web:api.bsky.app#bsky_appview"
        // }
      })

      return r.json()
    },
    enabled: !!(session?.did)
  })

  // const bskyPreferences = useQuery({
  //   queryKey: [session?.handle, 'bskyPreferences'],
  //   queryFn: async () => {

  //     const r = await fetch(`${import.meta.env.VITE_XRPC_HOST}/xrpc/app.bsky.actor.getPreferences`, {
  //       credentials: 'include'
  //     })

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
      <hr/>
      {/* <pre>
        {bskyProfile.data ? JSON.stringify(bskyProfile.data, null, 2) : null }
      </pre>
      <hr/> */}
      <pre>
        {bskyProfile2.data ? JSON.stringify(bskyProfile2.data, null, 2) : null }
      </pre>
      <hr/>
      {/* <pre>
        {bskyPreferences.data ? JSON.stringify(bskyPreferences.data, null, 2) : null }
      </pre> */}
      <hr/>

    </div>
  );
}

export default ProfileView;
