import { useAuthr } from "@blebbit/authr-react-tanstack";
import { useQuery } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"

import { type ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/widgets/data-table"

import {
  MoreHorizontal,
  ArrowUpDown
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
  id: string
  name: string
  role: "owner" | "member"
  extra?: any
}

export const columns: ColumnDef<GroupRow>[] = [{
  accessorKey: "name",
  header: ({ column }) => {
    return (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    )
  },

  cell: ({ row }) => {
    const g = row.original
    const url = `/groups/${g.id}`

    return (
      <Link
        to={url}
        className="text-blue-500 hover:underline"
      >
        {g.name}
      </Link>
    )
  }
},{
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
  id: "actions",
  cell: ({ row }) => {
    const g = row.original

    const leaveGroup = async () => {
      console.log("leave", g.name, g.id) 
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
          <DropdownMenuItem
            onClick={() => leaveGroup()}
          >
            Leave Group
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
}]


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
  console.log("authrGroups.data", authrGroups.data)

  const data = authrGroups.data as any

  if (data?.error) {
    return (
      <div className="flex flex-col gap-4">
        <p>Error: {data.error}</p>
      </div>
    )
  }

  if (!data?.groups || data.groups.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <p>You do not have nor are a member of any groups.</p>
      </div>
    )
  }

  const groups: GroupRow[] = data.groups.map((group: any) => {
    const value = JSON.parse(group.value)
    const rel = data.groupPerms.find((relation: any) =>
      relation.relationship.resource.objectId === group.id &&
      relation.relationship.subject.object.objectId.replaceAll("_", ":") === session?.did)
    return {
      id: group.id,
      name: value.name || value.title,
      role: rel?.relationship.relation || "n/a",
      extra: {
        group,
        value,
      }
    }
  })


  return (
    <div className="flex flex-col gap-4">
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={groups} />
      </div>
    </div>
  );
}

const GroupListItem = ({ group, perms }: { group: any, perms: any[] }) => {
  console.log("GroupListItem", group)

  var perm = perms.find((p: any) => p.relationship.resource.objectId === group.id)

  const value = JSON.parse(group.value)

  return (
    <div className="border-b py-4">
      <Link to={`/groups/${group.id}`} className="hover:underline">
        { value.name || value.title }
      </Link>
      ({ perm ? perm.relationship.relation : "no relation" })
    </div>
  )
}
