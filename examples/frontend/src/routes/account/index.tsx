import { createFileRoute } from '@tanstack/react-router'

import ProfileView from '@/components/views/profile';


// import { AccountPortal } from '@blebbit/authr-react';

export const Route = createFileRoute('/account/')({
  component: RouteComponent,
})

function RouteComponent() {

  return (
    <div className="flex flex-col gap-4 p-4">

      <div className="flex gap-4 m-2 justify-between items-center">
        <h1 className="text-4xl font-light">Profile</h1>
      </div>

      {/* <AccountPortal /> */}
      <ProfileView />

    </div>
  )
}
