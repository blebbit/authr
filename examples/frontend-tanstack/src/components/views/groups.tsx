import { useAuthr } from "@blebbit/authr-react-tanstack";
import { useQuery, useMutation } from "@tanstack/react-query"
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

import {
  appBlebbitAuthrGroupListGroups,
  appBlebbitAuthrGroupCreateGroupRelationship,
  appBlebbitAuthrGroupUpdateGroupRelationship,
  appBlebbitAuthrGroupDeleteGroupRelationship,
} from 'authr-example-flexicon/client-ts'

type GroupRow = {
  id: string
  name: string
  public: any
  role: "owner" | "editor" | "writer" | "reader" | "n/a"
  extra?: any
}

const columns: ColumnDef<GroupRow>[] = [{
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
  accessorKey: "public",
  header: ({ column }) => {
    return (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Public
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    )
  },
  cell: ({ row }) => {
    const g = row.original
    return (
      <span>
        {g.public ? "Yes" : "No"}
      </span>
    )
  }
},{
  accessorKey: "role",
  header: ({ column }) => {
    return (
      <Button
        variant="ghost"
        onClick={() => {
          console.log("toggleSorting", column.getIsSorted())
          column.toggleSorting(column.getIsSorted() === "asc")
        }}
      >
        Role 
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    )
  },
},{
  id: "actions",
  cell: ({ row, table }) => {
    const g = row.original

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
          {
            g.public && g.role === "n/a"
            ? (
              <DropdownMenuItem
                onClick={async () => {
                  console.log("join", g.name, g.id, table.options.meta)
                  // @ts-ignore
                  await table.options.meta.joinPublicGroup.mutate(g.id)
                }}
              >
                Join Group
              </DropdownMenuItem>
            ): null
          }
          {
            g.role !== "n/a"
            ? (
              <DropdownMenuItem
                onClick={async () => {
                  console.log("leave", g.name, g.id)
                  // @ts-ignore
                  await table.options.meta.leavePublicGroup.mutate(g.id)
                }}
              >
                Leave Group
              </DropdownMenuItem>
            ): null
          }
          {
            g.role === "owner"
            ? (
              <DropdownMenuItem
                onClick={async () => {
                  console.log("edit", g.name, g.id)
                }}
              >
                Edit Group
              </DropdownMenuItem>
            ): null
          }
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
      return appBlebbitAuthrGroupListGroups({})
    },
    enabled: !!(session?.did)
  })

  const joinPublicGroup = useMutation({
    mutationFn: async (groupId: string) => {
      return appBlebbitAuthrGroupCreateGroupRelationship({
        resource: groupId,
        relation: "reader",
        subject: session?.did,
      })
    },
  })

  const leavePublicGroup = useMutation({
    mutationFn: async (groupId: string) => {
      console.log("leavePublicGroup", groupId, session?.did)
      return appBlebbitAuthrGroupDeleteGroupRelationship({
        resource: groupId,
        subject: session?.did,
      })
    },
  })


  const meta = {
    joinPublicGroup,
    leavePublicGroup,
    slug: "love",
  }



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
      public: group.public,
      role: rel?.relationship.relation || "n/a",
      extra: {
        group,
        value,
        currDid: session?.did,
      }
    }
  })

  const filters = [{
    name: "Name",
    key: "name",
    placeholder: "Filter by name",
  }]

  return (
    <div className="flex flex-col gap-4">
      <div className="container mx-auto">
        <DataTable columns={columns} data={groups} meta={meta} filters={filters}/>
      </div>
    </div>
  );
}