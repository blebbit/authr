import { useQuery } from "@tanstack/react-query"

import { useAuthrContext } from "@/components/context/authr";

const PostsView = () => {
  const authr = useAuthrContext();
  const session = authr.session

  const authrPosts = useQuery({
    queryKey: [session?.handle, 'authrPosts'],
    queryFn: async () => {

      const r = await fetch(`${import.meta.env.VITE_XRPC_HOST}/xrpc/app.blebbit.authr.getPosts`, {
        credentials: 'include',
        headers: {
          'x-authr-recursive-proxy': 'true',
          'atproto-proxy': "did:web:api.blebbit.org#authr_appview"
        }
      })

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

  console.log("authrPosts", authrPosts)
  console.log("authrPosts.data", authrPosts.data)

  if (authrPosts.data?.error) {
    return (
      <div className="flex flex-col gap-4">
        <p>Error: {authrPosts.data.error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {authrPosts.data?.posts ? authrPosts.data.posts.map(post => (
        <div key={post.id} className="border-b py-4">
          <h2 className="text-xl font-semibold">{post.title}</h2>
          <p className="text-gray-600">{post.content}</p>
        </div>
      )) : null}
    </div>
  );
}

export default PostsView;
