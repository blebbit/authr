import { createFileRoute } from '@tanstack/react-router'

import { AccountPortal } from '@blebbit/authr-react-tanstack';
// import { Tabs } from "radix-ui";

const tabClass = "p-1 data-[state=active]:bg-blue-500 data-[state=active]:text-white  bg-secondary border rounded"

export const Route = createFileRoute('/account/')({
  component: RouteComponent,
})

function RouteComponent() {

  return (
    <div className="w-full h-full flex flex-col flex-grow">
      <AccountPortal />
    </div>
  )
}
