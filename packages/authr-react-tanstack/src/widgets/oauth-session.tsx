import { useQuery } from "@tanstack/react-query";
import { RespError } from "./resp-error";
import { useAuthr } from '../provider';

export const OauthSession = () => {
  const authr = useAuthr();

  const oauthSession = useQuery({
    queryKey: [authr.session?.did, 'acct', 'oauthSession'],
    queryFn: async () => {

      const r = await fetch(`${authr.options.xrpcHost}/xrpc/com.atproto.server.getSession`, {
        credentials: 'include',
      })

      return r.json()
    },
    enabled: !!(authr.session?.did)
  })

  if (oauthSession.isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-light text-2xl">Oauth Session:</h2>
      { oauthSession.error ? <RespError error={oauthSession.error} /> : null }
      <pre>
        {JSON.stringify(oauthSession.data, null, 2)}
      </pre>
    </div>
  );
}