import { createFileRoute, Link } from '@tanstack/react-router'

import PostsView from '@/components/views/posts'

export const Route = createFileRoute('/posts/')({
  component: RouteComponent,
})

function RouteComponent() {

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-4xl font-light">Posts</h1>
        <Link to="/posts/new" className="text-blue-500 border rounded-md px-2 py-1 hover:bg-blue-100">New</Link>
      </div>
      <PostsView />
    </div>
  )
}
