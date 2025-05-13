import { createFileRoute } from '@tanstack/react-router'

import PostsView from '@/components/views/posts'

export const Route = createFileRoute('/posts/')({
  component: RouteComponent,
})

function RouteComponent() {

  return (
    <div className="flex flex-col gap-4 p-4">
      <PostsView />
    </div>
  )
}
