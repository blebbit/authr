import { useAuthr } from "@blebbit/authr-react-tanstack";
import { Link } from "@tanstack/react-router"
import { useQuery, useQueries } from "@tanstack/react-query"

import { type ColumnDef } from "@tanstack/react-table"
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
  cell: ({ row }) => {
    const acctInfo = row.original

    const setRole = async (role: string) => {
      console.log("setRole", role, acctInfo.extra.relation.relationship.subject.object.objectId)
    }

    const removeAcct = async () => {
      console.log("removeAcct", acctInfo.extra.relation.relationship.subject.object.objectId) 
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Set Role</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onSelect={() => setRole("owner")}>Owner</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setRole("member")}>Member</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem
            onClick={() => removeAcct()}
          >
            Remove
          </DropdownMenuItem>
          <DropdownMenuSeparator />
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
    enabled: !!(session?.did)
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


  if (authrGroup.isLoading || acctInfos.some(info => info.isLoading)) {
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

  var relations: GroupRow[] = []
  if (data.groupRelations && data.groupRelations.length > 0) {
    relations = data.groupRelations.map((relation: any) => {
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
      </div>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={relations} />
      </div>
    </div>
  )
}