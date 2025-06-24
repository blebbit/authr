import { use, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type TreeDataItem } from '@/components/ui/tree-view';

import { AcctSearch } from "../acct-search";
import { Sharing } from "./sharing";

export const Dialogs = ({
  createPage,
  deletePage,
  createFolder,
  deleteFolder,
  handleSharing,
  ref,
}:{
  createPage?: (name: string, parent: string) => void
  deletePage?: (name: string, parent: string) => void
  createFolder?: (name: string, parent: string) => void
  deleteFolder?: (name: string, parent: string) => void
  handleSharing?: (name: string, parent: string, subject: string) => void
  ref?: React.Ref<HTMLDivElement>
}) => {
  const [openDialog, setOpenDialog] = useState("");
  const [openDialogItem, setOpenDialogItem] = useState("");

  const actions = {
    openCreatePage: (e: any, id: string) => {
      e.stopPropagation();
      e.preventDefault()
      setOpenDialog("create-page");
      setOpenDialogItem(id);
    },
    openDeletePage: (e: any, id: string) => {
      e.stopPropagation();
      e.preventDefault()
      setOpenDialog("delete-page");
      setOpenDialogItem(id);
    },
    openCreateFolder: (e: any, id: string) => {
      e.stopPropagation();
      e.preventDefault()
      setOpenDialog("create-folder");
      setOpenDialogItem(id);
    },
    openDeleteFolder: (e: any, id: string) => {
      e.stopPropagation();
      e.preventDefault()
      setOpenDialog("delete-folder");
      setOpenDialogItem(id);
    },
    openHandleSharing: (e: any, id: string) => {
      e.stopPropagation();
      e.preventDefault()
      setOpenDialog("handle-sharing");
      setOpenDialogItem(id);
    },
    setOpenDialog,
    setOpenDialogItem,
  }

  useEffect(() => {
    ref.current = actions;
  })


  return (
    <div className="flex flex-col">

      <Dialog open={openDialog === "create-page"} onOpenChange={(open) => setOpenDialog(open ? openDialog : "")}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Page</DialogTitle>
            <DialogDescription>
              Create a new page in the selected location.
            </DialogDescription>
          </DialogHeader>
          <form
						onSubmit={(event) => {
							event.preventDefault();
              const name = event.currentTarget.name.value
              console.log("Creating page with name:", name);
              createPage(name, openDialogItem);
						}}
					>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" defaultValue="New Page" />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </div>
					</form>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === "delete-page"} onOpenChange={(open) => setOpenDialog(open ? openDialog : "")}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete
              the page and all of its contents.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-between">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              variant="destructive"
              onClick={() => {
                console.log("Deleting page with id:", openDialogItem);
                deletePage?.(openDialogItem, openDialogItem);
                setOpenDialog("");
              }}
            >DELETE</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === "create-folder"} onOpenChange={(open) => setOpenDialog(open ? openDialog : "")}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Folder</DialogTitle>
            <DialogDescription>
              Create a new folder in the selected location.
            </DialogDescription>
          </DialogHeader>
          <form
						onSubmit={(event) => {
							event.preventDefault();
              const name = event.currentTarget.name.value
              console.log("Creating folder with name:", name);
                createFolder(name, openDialogItem);
						}}
					>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" defaultValue="New Folder" />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </div>
					</form>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === "delete-folder"} onOpenChange={(open) => setOpenDialog(open ? openDialog : "")}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete
              the folder and all of its contents.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-between">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              variant="destructive"
              onClick={() => {
                console.log("Deleting page with id:", openDialogItem);
                deletePage?.(openDialogItem, openDialogItem);
                setOpenDialog("");
              }}
            >DELETE</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === "handle-sharing"} onOpenChange={(open) => setOpenDialog(open ? openDialog : "")}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Handle Sharing</DialogTitle>
            <DialogDescription>
              Manage sharing settings for the selected page.
            </DialogDescription>
            <Sharing />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}