import { 
  FilePlus,
  FolderPlus,
  MoreHorizontal,
  Plus,
  ShieldPlus,
  Trash,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { type TreeDataItem } from '@/components/ui/tree-view';


export const TreeMenu = ({
  dialogRef,
}:{
  dialogRef: React.RefObject<any>
}) => {
  const actions = {
    openCreatePage: dialogRef?.current?.openCreatePage,
    openDeletePage: dialogRef?.current?.openDeletePage,
    openCreateFolder: dialogRef?.current?.openCreateFolder,
    openDeleteFolder: dialogRef?.current?.openDeleteFolder,
    openHandleSharing: dialogRef?.current?.openHandleSharing,
  }
  return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="h-8 w-8 p-0 rounded hover:border flex items-center justify-center hover:bg-gray-100 cursor-pointer">
            <span className="sr-only">top menu</span>
            <Plus className="h-6 w-6 text-gray-500 hover:text-blue-500" strokeWidth={1.5}/>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
          onClick={(e) => actions.openCreatePage(e, "")}
          >
            <FilePlus className="text-black" strokeWidth={1.5}/>Add Page
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => actions.openCreateFolder(e, "")}
          >
            <FolderPlus className="text-black" strokeWidth={1.5}/>Add Folder
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  )
}

export const NodeMenu = ({
  item,
  dialogRef,
}:{
  item: TreeDataItem,
  dialogRef: React.RefObject<any>
}) => {
  console.log("NodeAction", item, dialogRef, dialogRef?.current);
  const actions = {
    openCreatePage: dialogRef?.current?.openCreatePage,
    openDeletePage: dialogRef?.current?.openDeletePage,
    openCreateFolder: dialogRef?.current?.openCreateFolder,
    openDeleteFolder: dialogRef?.current?.openDeleteFolder,
    openHandleSharing: dialogRef?.current?.openHandleSharing,
  }
  // console.log("NodeAction", item);
  return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="h-6 w-6 p-0 rounded hover:border flex items-center justify-center hover:bg-gray-100 cursor-pointer">
            <span className="sr-only">menu</span>
            <MoreHorizontal className="h-4 w-4 text-gray-500 hover:text-blue-500" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={(e) => actions.openHandleSharing(e, item.id)}
          >
            <ShieldPlus className="text-black" strokeWidth={1.5}/>Sharing 
          </DropdownMenuItem>

          {item.children
            ? (
              <>
                <DropdownMenuItem
                onClick={(e) => actions.openCreatePage(e, item.id)}
                >
                  <FilePlus className="text-black" strokeWidth={1.5}/>Add Page
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => actions.openCreateFolder(e, item.id)}
                >
                  <FolderPlus className="text-black" strokeWidth={1.5}/>Add Folder
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => actions.openDeleteFolder(e, item.id)}
                >
                  <Trash className="text-black" strokeWidth={1.5}/>Delete 
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem
                onClick={(e) => actions.openDeletePage(e, item.id)}
              >
                <Trash className="text-black" strokeWidth={1.5}/>Delete 
              </DropdownMenuItem>
            )
          }
        </DropdownMenuContent>
      </DropdownMenu>
  )
}
