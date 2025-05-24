import { z } from 'zod';
import { RotateCw } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthr } from '@blebbit/authr-react';
import * as jose from 'jose';
import { useCookies } from 'react-cookie';
import { cn } from '@/lib/utils';

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
    queryKey: [session?.did, 'acct', 'oauthInfo'],
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
      console.log("invalidating queries", session.did, 'oauthInfo')
      queryClient.invalidateQueries({ queryKey: [session.did, 'acct'] });
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
        <div>
        </div>
        <span className="border rounded-md py-1 px-2 cursor-pointer hover:bg-gray-200" onClick={() => refreshOauthInfo.mutate()}>
          { refreshOauthInfo.isPending ?
            <div role="status">
              <svg aria-hidden="true" className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
            </div>
            :
            <RotateCw className={cn(
              "h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer",
              refreshOauthInfo.isError && "text-red-500 hover:text-red-700",
              refreshOauthInfo.isSuccess && "text-green-500 hover:text-green-700"
             )} />
          }
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