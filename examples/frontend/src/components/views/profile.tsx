import { useQuery } from "@tanstack/react-query"

import { useAuthr } from "@blebbit/authr-react";
import { OAuthInfo, type OAuthInfoType } from "@/components/widgets/oauth-info";
import { AtprotoInfo } from "@/components/widgets/atproto-info";
import { BskyProfile } from "@/components/widgets/bsky-profile";
import { BskyPreferences } from "@/components//widgets/bsky-preferences";

const ProfileView = () => {
  const authr = useAuthr();
  const session = authr.session

  const oauthInfo = useQuery({
    queryKey: [session?.handle, 'oauthInfo'],
    queryFn: async () => {

      const r = await fetch(`${import.meta.env.VITE_AUTHR_OAUTH_HOST}/oauth/info`, {
        credentials: 'include',
      })

      return r.json()
    },
    enabled: !!(session?.did)
  })

  const bskyProfile = useQuery({
    queryKey: [session?.handle, 'bskyProfile'],
    queryFn: async () => {

      const r = await fetch(`${import.meta.env.VITE_XRPC_HOST}/xrpc/app.bsky.actor.getProfile?actor=${session?.did}`, {
        credentials: 'include',
        headers: {
          // 'atproto-proxy': "did:web:api.bsky.app#bsky_appview"
        }
      })

      return r.json()
    },
    enabled: !!(session?.did)
  })

  const bskyPreferences = useQuery({
    queryKey: [session?.handle, 'bskyPreferences'],
    queryFn: async () => {

      const r = await fetch(`${import.meta.env.VITE_XRPC_HOST}/xrpc/app.bsky.actor.getPreferences`, {
        credentials: 'include',
        headers: {
          // 'atproto-proxy': "did:web:api.bsky.app#bsky_appview"
        }
      })

      return r.json()
    },
    enabled: !!(session?.did)
  })

  return (
    <div className="flex flex-col gap-4">

      {session ? <AtprotoInfo session={session} /> : null }
      {bskyProfile.data ? <BskyProfile data={bskyProfile.data} /> : null }
      <OAuthInfo oauthInfo={oauthInfo.data as OAuthInfoType} cookie={session.cookie} />
      {bskyPreferences.data ? <BskyPreferences data={bskyPreferences.data} /> : null }

    </div>
  );
}

export default ProfileView;
