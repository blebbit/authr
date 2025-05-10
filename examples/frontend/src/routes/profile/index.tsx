import { createFileRoute } from '@tanstack/react-router'

import { useAuthrContext } from "@/components/context/authr";

import { AccountSwitcher } from '@/components/widgets/acct-switcher';
import ProfileView from '@/components/views/profile';

export const Route = createFileRoute('/profile/')({
  component: RouteComponent,
})

function RouteComponent() {
  const authr = useAuthrContext();

  return (
    <div className="flex flex-col gap-4 p-4">

      <div className="flex gap-4 m-2 justify-between items-center">
        <h1 className="text-4xl font-light">Profile</h1>
        <AccountSwitcher />
      </div>

      <ProfileView />

    </div>
  )
}
