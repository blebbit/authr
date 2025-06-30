import { useAuthr } from "@blebbit/authr-react-tanstack";
import { Link } from "@tanstack/react-router"
import { useQuery, useQueries, useMutation, useQueryClient } from "@tanstack/react-query"

import { type ColumnDef } from "@tanstack/react-table"
import { AcctSearch } from "@/components/widgets/acct-search";
import { DataTable } from "@/components/widgets/data-table"

import { 
  ArrowLeft,
  ArrowUpDown,
  MoreHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"

import {
  appBlebbitAuthrGroupCreateGroupRelationship,
  appBlebbitAuthrGroupUpdateGroupRelationship,
  appBlebbitAuthrGroupDeleteGroupRelationship,
} from "authr-example-flexicon/client-ts"

type GroupRow = {
  did: string
  handle: string
  role: "owner" | "member"
  extra?: any
}

export const columns: ColumnDef<GroupRow>[] = [{
  accessorKey: "role",
  header: ({ column }) => {
    return (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Role 
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    )
  },
},{
  accessorKey: "handle",
  header: ({ column }) => {
    return (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Handle 
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    )
  },
  cell: ({ row }) => {
    const handle: string = row.getValue("handle")
    const url = `https://blebbit.app/at/${handle}`

    return (
      <Link
        to={url}
        className="text-blue-500 hover:underline"
      >
        {handle}
      </Link>
    )
  }
},{
  accessorKey: "did",
  header: "DID",
},{
  id: "actions",
  cell: ({ row, table }) => {
    const meta = table.options.meta as any
    const acctInfo = row.original

    const roles = ["owner", "editor", "reader"]

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">

          { meta.isOwner && (
            <>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Set Role</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {roles.map(role => (
                      <DropdownMenuItem
                        key={role}
                        onSelect={() => meta.setRole({ did: acctInfo.did, role })}
                      >
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem
                onClick={() => meta.removeMember(acctInfo.did)}
              >
                Remove
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}

          <DropdownMenuItem className="p-0">
            <Link to={`https://blebbit.app/at/${acctInfo.did}`}
              className="py-1.5 w-full text-center"
            >View on Blebbit</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
}]

export const GroupView = ({ id }: { id: string }) => {
  const queryClient = useQueryClient();
  const authr = useAuthr();
  const session = authr.session

  const authrGroup: any = useQuery({
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
    // enabled: !!(session?.did)
  })

  const acctInfos: any[] = useQueries({
    queries: (authrGroup.data?.groupRelations || []).map((relation: any) => ({
      queryKey: [relation.relationship.subject.object.objectId, 'info'],
      queryFn: async () => {
        const did = relation.relationship.subject.object.objectId.replaceAll("_", ":")
        const r = await fetch(`https://plc.blebbit.dev/info/${did}`)

        return r.json()
      },
      // enabled: !!(relation.relationship.subject.object.objectId)
    }))
  })

  const addMember = useMutation({
    mutationFn: async (did: string) => {
      console.log("addMember", id, did)
      return appBlebbitAuthrGroupCreateGroupRelationship({
        resource: id,
        relation: "reader",
        subject: did,
      })
    },
    onSuccess: (data) => {
      console.log("addMember.onSuccess", data)
      setTimeout(() => {
        console.log("addMember.onSuccess.invalidateQueries", id)
        queryClient.invalidateQueries({ queryKey:['authrGroups', id]})
      }, 3000)
    }
  })

  const setRole = useMutation({
    mutationFn: async ({did, role}: {did: string, role: string}) => {
      console.log("setRole", id, did, role)
      return appBlebbitAuthrGroupUpdateGroupRelationship({
        resource: id,
        relation: role,
        subject: did,
      })
    },
    onSuccess: (data) => {
      console.log("setRole.onSuccess", data)
      setTimeout(() => {
        console.log("setRole.onSuccess.invalidateQueries", id)
        queryClient.invalidateQueries({ queryKey:['authrGroups', id]})
      }, 2000)
    }
  })

  const removeMember = useMutation({
    mutationFn: async (did: string) => {
      console.log("removeMember", id, did)
      return appBlebbitAuthrGroupDeleteGroupRelationship({
        resource: id,
        subject: did,
      })
    },
    onSuccess: (data) => {
      console.log("removeMember.onSuccess", data)
      setTimeout(() => {
        console.log("removeMember.onSuccess.invalidateQueries", id)
        queryClient.invalidateQueries({ queryKey:['authrGroups', id]})
      }, 3000)
    }
  })



  if (authrGroup.isLoading || acctInfos.some(info => info.isLoading)) {
    return (
      <div className="flex flex-col gap-4">
        <p>Loading...</p>
      </div>
    )
  }

  // console.log("authrGroup", authrGroup)
  // console.log("authrGroup.data", authrGroup.data)

  const data = authrGroup.data as any
  const group = data?.groups?.[0] || null
  // console.log("authrGroup.group", group)
  const value = JSON.parse(group?.value || '{}')

  if (data?.error) {
    return (
      <div className="flex flex-col gap-4">
        <p>Error: {data.error}</p>
      </div>
    )
  }

  var relations: GroupRow[] = []
  if (data?.groupRelations && data?.groupRelations.length > 0) {
    relations = data.groupRelations.map( (relation: any) => {
      const did = relation.relationship.subject.object.objectId.replaceAll("_", ":")
      const info = acctInfos.find(info => info.data?.did === did)

      return {
        did,
        handle: info.data?.handle,
        role: relation.relationship.relation,
        extra: {
          relation,
          info,
        }
      }
    })
  }

  console.log("relations", relations)

  const meta = {
    setRole: setRole.mutate,
    addMember: addMember.mutate,
    removeMember: removeMember.mutate,
    slug: "love",
    isOwner: data?.groupRelations.some((relation: any) =>
      relation.relationship.subject.object.objectId.replaceAll("_", ":") === session?.did &&
      relation.relationship.relation === "owner"
    ),
    group,
    groupId: group?.id,
  }

  const filters = [{
    name: "Handle",
    key: "handle",
    placeholder: "Filter by handle",
  }]


  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-row gap-2 items-center">
        <Link
          to="/groups"
          className="text-blue-500 hover:underline"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <span className="text-3xl font-light">{value.name || value.title}</span>
        { group.public ?
          <span className="rounded px-1 py-0 text-[.6rem] text-white bg-green-500 inline-block align-middle max-h-4">public</span>
          : 
          <span className="rounded px-1 py-0 text-[.6rem] text-white bg-red-500 inline-block align-middle max-h-4">private</span>
        }

        <div className="flex flex-grow gap-2 justify-end">
          <AcctSearch 
            addMember={addMember.mutate}
          />
        </div>
      </div>
      <div className="container mx-auto">
        <DataTable columns={columns} data={relations} meta={meta} filters={filters}/>
      </div>
    </div>
  )
}