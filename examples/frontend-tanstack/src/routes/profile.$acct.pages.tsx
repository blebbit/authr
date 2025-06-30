import { createFileRoute, Link } from '@tanstack/react-router'
import PagesLayout from '@/components/views/pages'

export const Route = createFileRoute('/profile/$acct/pages')({
  component: RouteComponent,
})

function RouteComponent() {
  const { acct } = Route.useParams()
  return ( <PagesLayout account={acct}/> )
}