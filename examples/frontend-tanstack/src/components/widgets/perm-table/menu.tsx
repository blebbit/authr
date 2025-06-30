import { Link } from "@tanstack/react-router"

import {
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

export const PermissionTableMenu = ({
  meta,
  row,
}:{
  meta: any,
  row: any,
}) => {
  const roles = meta.roles
  const acctInfo = row.original
  // console.log("PermissionTableMenu", { meta, row, roles, acctInfo })

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
                      onSelect={() => meta.updateRelation({ id: acctInfo.id, relation: role })}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem
              onClick={() => meta.deleteRelation({ id: acctInfo.id })}
            >
              Remove
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

      </DropdownMenuContent>
    </DropdownMenu>
  )
}