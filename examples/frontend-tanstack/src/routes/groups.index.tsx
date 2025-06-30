import { createFileRoute, Link } from '@tanstack/react-router'

import { GroupsList } from '@/components/views/groups'

export const Route = createFileRoute('/groups/')({
  component: RouteComponent,
})

function RouteComponent() {

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-3xl font-light">Your Groups</h1>
        <Link to="/groups/new" className="text-blue-500 border rounded-md px-2 py-1 hover:bg-blue-100">New</Link>
      </div>
      <GroupsList />
    </div>
  )
}
