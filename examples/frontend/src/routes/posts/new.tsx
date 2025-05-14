import { createFileRoute } from '@tanstack/react-router'

import { HandleForm } from '@/components/forms/new-post'

export const Route = createFileRoute('/posts/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-4xl font-light">New Post</h1>
      <HandleForm />
    </div>
  )
}
