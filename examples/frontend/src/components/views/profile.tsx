import { useQuery } from "@tanstack/react-query"

const ProfileView = ({session}: {session: any}) => {

  const bskyProfile = useQuery({
    queryKey: [session?.handle, 'bskyProfile'],
    queryFn: async () => {

      const r = await fetch(`${import.meta.env.VITE_AUTHR_OAUTH_HOST}/xrpc/${session?.did}/app.bsky.actor.profile/self`, {
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

  return (
    <div>
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
