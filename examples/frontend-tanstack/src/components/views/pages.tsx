import { useState } from "react";
import { useQuery } from "@tanstack/react-query"

import { useAuthr } from "@blebbit/authr-react-tanstack";

import { FolderTree } from "@/components/widgets/folder-tree";

const PagesLayout = () => {

  const [currItem, setCurrItem] = useState<any>(null);

  return (
    <div className="flex flex-row flex-grow items-stretch">
      <div className="flex flex-col gap-4 w-64 p-1 border-r">
        <FolderTree 
          onSelectChange={(item) => {
            console.log("onSelect", item)
            setCurrItem(item)
          }}
        />
      </div>
      <PageView page={currItem}/>
    </div>
  );
}

const PageView = ({
  page,
}:{
  page?: any
}) => {
  const authr = useAuthr();
  const session = authr.session

  const authrPosts = useQuery({
    queryKey: [session?.handle, 'authrPages'],
    queryFn: async () => {

      const r = await fetch(
        `${import.meta.env.VITE_XRPC_HOST}/xrpc/app.blebbit.authr.getPosts`,
      {
          credentials: 'include',
          headers: {
            // 'x-authr-recursive-proxy': 'true',
            // 'atproto-proxy': "did:web:api.authr.blebbit.dev#authr_appview"
          }
        }
      )

      return r.json()
    },
    enabled: !!(session?.did)
  })

  if (authrPosts.isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <p>Loading...</p>
      </div>
    )
  }

  // console.log("authrPosts", authrPosts)
  // console.log("authrPosts.data", authrPosts.data)

  const data = authrPosts.data as any

  if (data?.error) {
    return (
      <div className="flex flex-col gap-4">
        <p>Error: {data.error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 flex-grow p-1">
      <span className="text-2xl font-semibold">Your Page: {page?.name}</span>
      <pre>{page?.content}</pre>
    </div>
  );
}

export default PagesLayout;
