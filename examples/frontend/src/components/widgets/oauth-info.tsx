import { z } from 'zod';
import { RotateCcw } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthr } from '@blebbit/authr-react';

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
export const OAuthInfo = ({ oauthInfo, cookie }: { oauthInfo: OAuthInfoType, cookie: string }) => {
  const queryClient = useQueryClient();
  const authr = useAuthr();

  const refreshOauthInfo = useMutation({
    mutationFn: async () => {
      console.log("refreshOauthInfo.mutate", oauthInfo.sub)
      const response = await fetch(`${import.meta.env.VITE_AUTHR_OAUTH_HOST}/oauth/refresh?did=${oauthInfo.sub}`, {
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

  const session = authr.session

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
            <dd className="ml-2 font-light text-gray-600 break-all">{oauthInfo.aud}</dd>
          </div>

          <div className="col-span-1 md:col-span-1 flex items-end">
            <dt className="font-medium text-gray-500">Subject (sub):</dt>
            <dd className="ml-2 font-light text-gray-600 break-all">{oauthInfo.sub}</dd>
          </div>

          <div className="col-span-1 md:col-span-1 flex items-end">
            <dt className="font-medium text-gray-500">Issuer (iss):</dt>
            <dd className="ml-2 font-light text-gray-600 break-all">{oauthInfo.iss}</dd>
          </div>

          <div className="col-span-1 md:col-span-1 flex items-end">
            <dt className="font-medium text-gray-500">Token Type:</dt>
            <dd className="ml-2 font-light text-gray-600">{oauthInfo.token_type}</dd>
          </div>

          <div className="col-span-1 md:col-span-2 flex items-end">
            <dt className="font-medium text-gray-500">Scope:</dt>
            <dd className="ml-2 font-light text-gray-600 break-all">{oauthInfo.scope}</dd>
          </div>

          <div className="col-span-1 md:col-span-1 flex items-end">
            <dt className="font-medium text-gray-500">Access Issued At:</dt>
            <dd className="ml-2 font-light text-gray-600">{new Date(oauthInfo.access_issued_at).toLocaleString()}</dd>
          </div>

          <div className="col-span-1 md:col-span-1 flex items-end">
            <dt className="font-medium text-gray-500">Access Expires At:</dt>
            <dd className="ml-2 font-light text-gray-600">{new Date(oauthInfo.access_expires_at).toLocaleString()}</dd>
          </div>

          <div className="col-span-1 md:col-span-1 flex items-end">
            <dt className="font-medium text-gray-500">Refresh Expires At:</dt>
            <dd className="ml-2 font-light text-gray-600">{new Date(oauthInfo.refresh_expires_at).toLocaleString()}</dd>
          </div>

          <div className="col-span-1 md:col-span-1 flex items-end">
            <dt className="font-medium text-gray-500">Access Token Hash:</dt>
            <dd className="ml-2 font-light text-gray-600 max-w-1/2">{oauthInfo.access_token_hash}</dd>
          </div>

          <div className="col-span-1 md:col-span-1 flex items-end">
            <dt className="font-medium text-gray-500">Refresh Token Hash:</dt>
            <dd className="ml-2 font-light text-gray-600 max-w-1/2">{oauthInfo.refresh_token_hash}</dd>
          </div>

          <div className="col-span-1 md:col-span-1 flex items-end">
            <dt className="font-medium text-gray-500">Authr Cookie:</dt>
            <dd className="ml-2 font-light text-gray-600 max-w-1/2">{cookie}</dd>
          </div>
        </dl>
      )}
    </div>
  );
}