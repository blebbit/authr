import { createFileRoute, Link } from '@tanstack/react-router'

import PagesLayout from '@/components/views/pages'

export const Route = createFileRoute('/pages')({
  component: RouteComponent,
})

function RouteComponent() {
  return ( <PagesLayout /> )
}
