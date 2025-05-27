import { useQuery } from "@tanstack/react-query"
import { useAuthr } from "@blebbit/authr-react-tanstack";

const PostsView = () => {
  const authr = useAuthr();
  const session = authr.session

  const authrPosts = useQuery({
    queryKey: [session?.handle, 'authrPosts'],
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
    <div className="flex flex-col gap-4">
      {data?.posts ? data.posts.map(post => {
        return (
          <PostView key={post.id} post={post} />
        )
      }) : null}
    </div>
  );
}

const PostView = ({ post }: { post: any }) => {
  const acctInfo = useQuery({
    queryKey: [post.acct, 'info'],
    queryFn: async () => {

      const r = await fetch(`https://plc.blebbit.dev/info/${post.acct}`)

      return r.json()
    },
    enabled: !!(post?.acct)
  })

  console.log("PostView", post, acctInfo.data)

  const record = JSON.parse(post.value)
  return (
    <div className="border-b py-4">
      <span className="flex flex-row gap-2">
        <h2 className="text-xl font-semibold">{record.title}</h2>
        { record.draft ? <span className="text-sm text-gray-500">(draft)</span> : null }
        { post.public ?
          <span className="rounded px-1 py-0 text-[.6rem] text-white bg-green-500 inline-block align-middle max-h-4">public</span>
          : 
          <span className="rounded px-1 py-0 text-[.6rem] text-white bg-red-500 inline-block align-middle max-h-4">private</span>
        }
        <span className="text-sm text-gray-500">
          @{acctInfo.isLoading ? "loading..." : acctInfo.data?.handle || post.acct}
        </span>
      </span>
      <p className="text-gray-600">{record.content}</p>
    </div>
  )
}

export default PostsView;
