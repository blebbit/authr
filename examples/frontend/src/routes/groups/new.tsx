import { createFileRoute } from '@tanstack/react-router'

import { HandleForm } from '@/components/forms/new-group'

export const Route = createFileRoute('/groups/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-4xl font-light">New Group</h1>
      <HandleForm />
    </div>
  )
}
