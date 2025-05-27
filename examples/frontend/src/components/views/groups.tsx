import { useQuery } from "@tanstack/react-query"
import { useAuthr } from "@blebbit/authr-react-tanstack";

export const GroupsList = () => {
  const authr = useAuthr();
  const session = authr.session

  const authrGroups = useQuery({
    queryKey: [session?.handle, 'authrGroups'],
    queryFn: async () => {

      const r = await fetch(
        `${import.meta.env.VITE_XRPC_HOST}/xrpc/app.blebbit.authr.getGroups`,
      {
          credentials: 'include',
          headers: {
            // 'x-authr-recursive-proxy': 'true',
            // 'atproto-proxy': "did:web:api.authr.blebbit.dev#authr_appview"
          }
        }
      )

      return r.json()
    },
    enabled: !!(session?.did)
  })

  if (authrGroups.isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <p>Loading...</p>
      </div>
    )
  }

  // console.log("authrGroups", authrGroups)
  // console.log("authrGroups.data", authrGroups.data)

  const data = authrGroups.data as any

  if (data?.error) {
    return (
      <div className="flex flex-col gap-4">
        <p>Error: {data.error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {data?.groups ? data.groups.map(group => {
        return (
          <GroupListItem key={group.id} group={group} perms={data.groupPerms} />
        )
      }) : null}
    </div>
  );
}

const GroupListItem = ({ group, perms }: { group: any, perms: any[] }) => {
  console.log("GroupListItem", group)

  var perm = perms.find((p: any) => p.relationship.resource.objectId === group.id)

  const value = JSON.parse(group.value)

  return (
    <div className="border-b py-4">
      { value.name || value.title } ({ perm ? perm.relationship.relation : "no relation" })
    </div>
  )
}
