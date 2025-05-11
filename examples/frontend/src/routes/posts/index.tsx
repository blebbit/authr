import { createFileRoute } from '@tanstack/react-router'

import { useAuthrContext } from "@/components/context/authr";

export const Route = createFileRoute('/posts/')({
  component: RouteComponent,
})

function RouteComponent() {
  const authr = useAuthrContext();

  return (
    <div className="flex flex-col gap-4 p-4">

      <div className="flex gap-4 m-2 justify-between items-center">
        <h1 className="text-4xl font-light">Posts</h1>
      </div>

    </div>
  )
}
