import { createFileRoute } from '@tanstack/react-router'

import { useAuthrContext } from "@/components/context/authr";

import ProfileView from '@/components/views/profile';

export const Route = createFileRoute('/profile/')({
  component: RouteComponent,
})

function RouteComponent() {
  const authr = useAuthrContext();

  return (
    <div>
      <h1>Profile</h1>
      <p>This is the profile page.</p>
      <hr/>
      <pre>
        {authr.session ? JSON.stringify(authr.session, null, 2) : null }
      </pre>
      <hr/>
      <ProfileView session={authr.session} />
      <hr/>
    </div>
  )
}
