import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/profile/$acct/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { acct } = Route.useParams()
  return (
    <div>
      <h1 className="text-2xl font-bold">Profile: {acct}</h1>
      <Link to={`/profile/${acct}/pages`} className="text-blue-500 hover:underline">
        Go to Pages
      </Link>

      <div className="flex flex-col gap-4 flex-grow p-1 overflow-y-auto overflow-x-hidden">
        tbd
      </div>
    </div>
  )
}