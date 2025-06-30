import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/profile/$acct')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col gap-4 flex-grow overflow-y-auto overflow-x-hidden">
      <Outlet />
    </div>
  )
}
