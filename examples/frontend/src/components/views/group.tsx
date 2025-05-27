import { useAuthr } from "@blebbit/authr-react-tanstack";
import { useQuery } from "@tanstack/react-query"


export const GroupView = ({ id }: { id: string }) => {
  const authr = useAuthr();
  const session = authr.session

  const authrGroup = useQuery({
    queryKey: ['authrGroups', id],
    queryFn: async () => {

      const r = await fetch(
        `${import.meta.env.VITE_XRPC_HOST}/xrpc/app.blebbit.authr.getGroup?id=${id}`,
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

  if (authrGroup.isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <p>Loading...</p>
      </div>
    )
  }

  console.log("authrGroup", authrGroup)
  console.log("authrGroup.data", authrGroup.data)

  const data = authrGroup.data as any
  const group = data?.groups?.[0] || null
  console.log("authrGroup.group", group)
  const value = JSON.parse(group?.value || '{}')

  if (data?.error) {
    return (
      <div className="flex flex-col gap-4">
        <p>Error: {data.error}</p>
      </div>
    )
  }

  return (
    <div>
      <span className="text-3xl font-light">{value.name || value.title}</span>

      { data.groupRelations && data.groupRelations.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-semibold">Members</h3>
          { data.groupRelations.map((member: any) => (
             <MemberView key={member.relationship.subject.object.objectId} data={member} /> 
          ))}
        </div>
      )}
    </div>
  )
}

const MemberView = ({ data}: { data: any }) => {
  console.log("MemberView.data", data)
  const did = data.relationship.subject.object.objectId.replaceAll("_", ":")
  const rel = data.relationship.relation

  const acctInfo: any = useQuery({
    queryKey: [did, 'info'],
    queryFn: async () => {

      const r = await fetch(`https://plc.blebbit.dev/info/${did}`)

      return r.json()
    },
    enabled: !!(did)
  })

  console.log("MemberView.acctInfo", acctInfo.data)

  return (
    <div>
        <span className="text-sm text-gray-500">
          @{acctInfo.isLoading ? "loading..." : acctInfo.data?.handle || did} ({rel})
        </span>
    </div>
  )
}