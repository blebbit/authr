import { createFileRoute } from '@tanstack/react-router'

import { GroupView } from '@/components/views/group'

export const Route = createFileRoute('/groups/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  return <GroupView gid={id} />
}
