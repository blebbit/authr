import { z } from 'zod';
import { RotateCcw } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthr } from '@blebbit/authr-react';
import * as jose from 'jose';
import { useCookies } from 'react-cookie';

export const OAuthInfoTypeSchema = z.object({
  aud: z.string(),
  sub: z.string(),
  iss: z.string(),
  token_type: z.string(),
  scope: z.string(),
  access_issued_at: z.string(),
  access_expires_at: z.string(),
  refresh_expires_at: z.string(),
  access_token_hash: z.string(),
  refresh_token_hash: z.string(),
});

export interface OAuthInfoType {
  aud: string;
  sub: string;
  iss: string;
  token_type: string;
  scope: string;
  access_issued_at: number;
  access_expires_at: number;
  refresh_expires_at: string;
  access_token_hash: string;
  refresh_token_hash: string;
}

// AI wrote this tailwind, it's not very good
export const OAuthInfo = ({ session }: { session: any }) => {
  const queryClient = useQueryClient();
  const [cookies] = useCookies();
  console.log("OAuthInfo.session", session, cookies)

  const oauthInfo = useQuery({
    queryKey: [session?.handle, 'oauthInfo'],
    queryFn: async () => {
      const claims = await jose.decodeJwt(session.cookie)
      console.log("oauthInfo.queryFn", session.did, claims, cookies)

      const r = await fetch(`${import.meta.env.VITE_AUTHR_OAUTH_HOST}/oauth/info`, {
        credentials: 'include',
      })

      console.log("oauthInfo.queryFn.r", r)

      const data = await r.json()
      console.log("oauthInfo.queryFn.data", data)
      return data
    },
    enabled: !!(session?.did)
  })


  const refreshOauthInfo = useMutation({
    mutationFn: async () => {
      console.log("refreshOauthInfo.mutate", session.did)
      const response = await fetch(`${import.meta.env.VITE_AUTHR_OAUTH_HOST}/oauth/refresh?did=${session.did}`, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (!response.ok) {
        throw new Error('Failed to refresh OAuth info');
      }
      return await response.json();
    },
    onSuccess: () => {
      console.log("invalidating queries", session.handle, 'oauthInfo')
      queryClient.invalidateQueries({ queryKey: [session.handle, 'oauthInfo'] });
    },
  })

  if (oauthInfo.isLoading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }
  if (oauthInfo.isError) {
    return <div className="flex items-center justify-center h-full">Error loading OAuth info</div>;
  }

  const data: any = oauthInfo.data
  console.log("OAuthInfo.data", data)

  return (
    <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200 overflow-hidden">

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-light text-gray-700">OAuth Information</h2>
        <span className="border rounded-md py-1 px-2 cursor-pointer hover:bg-gray-200" onClick={() => refreshOauthInfo.mutate()}>
          <RotateCcw className="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer" />
        </span>
      </div>

      {oauthInfo && (
        <dl className="flex flex-col gap-x-4 gap-y-2">
          {/* chanded the above to flex */}
          <div className="col-span-1 md:col-span-1 flex items-end">
            <dt className="font-medium text-gray-500">Audience (aud):</dt>
            <dd className="ml-2 font-light text-gray-600 break-all">{data.aud}</dd>
          </div>

          <div className="col-span-1 md:col-span-1 flex items-end">
            <dt className="font-medium text-gray-500">Subject (sub):</dt>
            <dd className="ml-2 font-light text-gray-600 break-all">{data.sub}</dd>
          </div>

          <div className="col-span-1 md:col-span-1 flex items-end">
            <dt className="font-medium text-gray-500">Issuer (iss):</dt>
            <dd className="ml-2 font-light text-gray-600 break-all">{data.iss}</dd>
          </div>

          <div className="col-span-1 md:col-span-1 flex items-end">
            <dt className="font-medium text-gray-500">Token Type:</dt>
            <dd className="ml-2 font-light text-gray-600">{data.token_type}</dd>
          </div>

          <div className="col-span-1 md:col-span-2 flex items-end">
            <dt className="font-medium text-gray-500">Scope:</dt>
            <dd className="ml-2 font-light text-gray-600 break-all">{data.scope}</dd>
          </div>

          <div className="col-span-1 md:col-span-1 flex items-end">
            <dt className="font-medium text-gray-500">Access Issued At:</dt>
            <dd className="ml-2 font-light text-gray-600">{new Date(data.access_issued_at).toLocaleString()}</dd>
          </div>

          <div className="col-span-1 md:col-span-1 flex items-end">
            <dt className="font-medium text-gray-500">Access Expires At:</dt>
            <dd className="ml-2 font-light text-gray-600">{new Date(data.access_expires_at).toLocaleString()}</dd>
          </div>

          <div className="col-span-1 md:col-span-1 flex items-end">
            <dt className="font-medium text-gray-500">Refresh Expires At:</dt>
            <dd className="ml-2 font-light text-gray-600">{new Date(data.refresh_expires_at).toLocaleString()}</dd>
          </div>

          <div className="col-span-1 md:col-span-1 flex items-end">
            <dt className="font-medium text-gray-500">Access Token Hash:</dt>
            <dd className="ml-2 font-light text-gray-600 max-w-1/2">{data.access_token_hash}</dd>
          </div>

          <div className="col-span-1 md:col-span-1 flex items-end">
            <dt className="font-medium text-gray-500">Refresh Token Hash:</dt>
            <dd className="ml-2 font-light text-gray-600 max-w-1/2">{data.refresh_token_hash}</dd>
          </div>

          <div className="col-span-1 md:col-span-1 flex items-end">
            <dt className="font-medium text-gray-500">Authr Cookie:</dt>
            <dd className="ml-2 font-light text-gray-600 max-w-1/2">{session.cookie}</dd>
          </div>
        </dl>
      )}
    </div>
  );
}