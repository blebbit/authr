import { useQuery } from "@tanstack/react-query";
import { RespError } from "./resp-error";
import { useAuthr } from '../provider';

export const BskyProfile = () => {
  const authr = useAuthr();

  const bskyProfile = useQuery({
    queryKey: [authr.session?.did, 'acct', 'bskyProfile'],
    queryFn: async () => {

      const r = await fetch(`${authr.options.xrpcHost}/xrpc/app.bsky.actor.getProfile?actor=${authr.session?.did}`, {
        credentials: 'include',
      })

      return r.json()
    },
    enabled: !!(authr.session?.did)
  })

  if (bskyProfile.isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-light text-2xl">Bluesky Profile:</h2>
      { bskyProfile.error ? <RespError error={bskyProfile.error} /> : null }
      <h2 className="ml-4 text-gray-600">Handle: @{bskyProfile.data?.handle}</h2>
      <p className="ml-4 text-gray-600">Display: {bskyProfile.data?.displayName}</p>
      {/* <p className="ml-4 text-gray-600">Display: {bskyProfile.data?.displayName}</p> */}
    </div>
  );
}