import { createFileRoute, Link } from '@tanstack/react-router'
import FolderView from "@/components/views/folder";

export const Route = createFileRoute('/pages/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col gap-4 flex-grow p-1 overflow-y-auto overflow-x-hidden">
      <FolderView />
    </div>
  )
}
