import { createFileRoute, Link } from '@tanstack/react-router'
import FolderView from "@/components/views/folder";

export const Route = createFileRoute('/profile/$acct/pages/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { acct } = Route.useParams()
  return (
    <div className="flex flex-col gap-4 flex-grow p-1 overflow-y-auto overflow-x-hidden">
      <FolderView account={acct}/>
    </div>
  )
}
