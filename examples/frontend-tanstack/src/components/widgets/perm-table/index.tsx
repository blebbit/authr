import { useAuthr } from "@blebbit/authr-react-tanstack";
import { Link } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

import { type ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/widgets/data-table"
import { PermissionTableMenu } from "@/components/widgets/perm-table/menu"

type TableRow = {
  id: string
  name: string
  role: string
  extra?: any
}

export const columns: ColumnDef<TableRow>[] = [{
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
    const id: string = row.getValue("id")
    const name: string = row.getValue("name")
    var url = `/group/${id}`

    if (id.startsWith("did:")) {
      url = `/profile/${name}`
    }

    return (
      <Link
        to={url}
        className="text-blue-500 hover:underline"
      >
        {name}
      </Link>
    )
  }
},{
  accessorKey: "id",
  header: "ID",
},{
  id: "actions",
  cell: ({ row, table }) => {
    const meta = table.options.meta as any

    return (
      <PermissionTableMenu
        meta={meta}
        row={row}
      />
    )
  },
}]

export const PermissionTable = ({
  roles,
  relations,
  memberInfos,
  createRelation,
  updateRelation,
  deleteRelation,
}: {
  roles: string[],
  relations: any[],
  memberInfos: any[],
  createRelation: ({ id, relation } : {id: string, relation: any}) => void,
  updateRelation: ({ id, relation } : {id: string, relation: any}) => void,
  deleteRelation: ({ id } : {id: string}) => void,
}) => {
  // console.log("relations", relations, memberInfos)

  const { session } = useAuthr()

  var rows: TableRow[] = []
  if (relations && relations.length > 0) {
    rows = relations.map( (relation: any) => {
      const id = relation.relationship.subject.object.objectId.replaceAll("_", ":")
      const info = memberInfos.find(info => info.data?.did === id || info.data?.group?.id === id)
      if (info?.data?.group?.value && typeof info.data.group.value === "string") {
        try {
          info.data.group.value = JSON.parse(info.data.group.value);
        } catch (error) {
          console.error("Failed to parse group value", error);
        }
      }

      return {
        id,
        name: info?.data?.group?.value?.name || info?.data?.handle || id,
        role: relation.relationship.relation,
        extra: {
          relation,
          info,
        }
      }
    })
  }

  // filter rows by role
  rows = rows.filter(row => row.role !== "parent")

  // console.log("rows", rows)

  const meta = {
    roles,
    createRelation,
    updateRelation,
    deleteRelation,
    isOwner: relations.some((relation: any) =>
      relation.relationship.subject.object.objectId.replaceAll("_", ":") === session?.did &&
      relation.relationship.relation === "owner"
    ),
  }

  const filters = [{
    name: "Name",
    key: "name",
    placeholder: "Filter by name",
  }]


  return (
    <div className="container mx-auto">
      <DataTable columns={columns} data={rows} meta={meta} filters={filters}/>
    </div>
  )
}
