import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/groups')({
  component: RouteComponent,
})

function RouteComponent() {

  return (
    <div className="flex flex-col gap-4 p-4">
      <Outlet />
    </div>
  )
}
