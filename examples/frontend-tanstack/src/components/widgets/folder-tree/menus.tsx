import { useNavigate } from "@tanstack/react-router";

import { 
  FilePlus,
  FolderPlus,
  MoreHorizontal,
  Pencil,
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
import { useState } from "react";
import { APP_BLEBBIT_AUTHR_FOLDER_RECORD_DOC } from "authr-example-flexicon/common-ts";


export const TreeMenu = ({
  dialogRef,
}:{
  dialogRef: React.RefObject<any>
}) => {

  const [menuOpen, setMenuOpen] = useState(false);

  const onClick = (e: any, dialog: string) => {
    console.log("TreeMenu.onClick", e, dialog);
    e.stopPropagation();
    e.preventDefault();
    if (dialogRef.current) {
      dialogRef.current.showDialog(e, dialog, "");
    }

    setMenuOpen(false);
  }

  return (
    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <div className="h-8 w-8 p-0 rounded hover:border flex items-center justify-center hover:bg-gray-100 cursor-pointer">
          <span className="sr-only">top menu</span>
          <Plus className="h-6 w-6 text-gray-500 hover:text-blue-500" strokeWidth={1.5}/>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={(e: any) => onClick(e, "create-page")}>
          <FilePlus className="text-black" strokeWidth={1.5}/>Add Page
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e: any) => onClick(e, "create-folder")}>
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
  // console.log("NodeAction", item, dialogRef, dialogRef?.current);

  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const onClick = (e: any, dialog: string) => {
    console.log("NodeMenu.onClick", e, dialog, item);
    e.stopPropagation();
    e.preventDefault();
    if (dialogRef.current) {
      dialogRef.current.showDialog(e, dialog, item);
    }

    setMenuOpen(false);
  }

  return (
    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <div className="h-6 w-6 p-0 rounded hover:border flex items-center justify-center hover:bg-gray-100 cursor-pointer">
          <span className="sr-only">menu</span>
          <MoreHorizontal className="h-4 w-4 text-gray-500 hover:text-blue-500" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">

        {item.nsid === APP_BLEBBIT_AUTHR_FOLDER_RECORD_DOC.id
          ? (
            <>
              <DropdownMenuItem onClick={(e) => onClick(e, "share-folder")} >
                <ShieldPlus className="text-black" strokeWidth={1.5}/>Sharing 
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => onClick(e, "create-page")} >
                <FilePlus className="text-black" strokeWidth={1.5}/>Add Page
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => onClick(e, "create-folder")} >
                <FolderPlus className="text-black" strokeWidth={1.5}/>Add Folder
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => onClick(e, "rename-folder")} >
                <Pencil className="text-black" strokeWidth={1.5}/>Rename
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => onClick(e, "delete-folder")} className="hover:bg-red-500/50!">
                <Trash className="text-black" strokeWidth={1.5}/>Delete 
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem onClick={(e) => onClick(e, "share-page")} >
                <ShieldPlus className="text-black" strokeWidth={1.5}/>Sharing 
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => onClick(e, "rename-page")} >
                <Pencil className="text-black" strokeWidth={1.5}/>Rename
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => onClick(e, "delete-page")} className="hover:bg-red-500/50!">
                <Trash className="text-black" strokeWidth={1.5}/>Delete 
              </DropdownMenuItem>
            </>
          )
        }
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
