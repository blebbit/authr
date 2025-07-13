import { use, useEffect, useState } from "react";
import { useQuery, useQueries, useMutation, useQueryClient } from "@tanstack/react-query"

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

import { Sharing } from "./folder-tree/sharing";
import { PermissionTable } from "../widgets/perm-table";

import {
  appBlebbitAuthrGroupGetGroup,
  appBlebbitAuthrPageCreatePageRelationship,
  appBlebbitAuthrPageUpdatePageRelationship,
  appBlebbitAuthrPageDeletePageRelationship,
  appBlebbitAuthrFolderCreateFolderRelationship,
  appBlebbitAuthrFolderUpdateFolderRelationship,
  appBlebbitAuthrFolderDeleteFolderRelationship,
} from "authr-example-flexicon/client-ts";

const Footer = ({ children }: { children?: any }) => {
  return (
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
      {children}
    </DialogFooter>
  );
}

export const Dialogs = ({
  createPage,
  deletePage,
  renamePage,
  createFolder,
  deleteFolder,
  renameFolder,
  ref,
}:{
  createPage?: (parent: string, name: string) => void
  deletePage?: (id: string) => void
  renamePage?: (id: string, name: string) => void
  createFolder?: (parent: string, name: string) => void
  deleteFolder?: (id: string) => void
  renameFolder?: (id: string, name: string) => void
  ref?: React.Ref<HTMLDivElement>
}) => {
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState("");
  const [openDialogItem, setOpenDialogItem] = useState(null);

  const actions = {
    showDialog: (e: any, dialog: string, item: any) => {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
      setOpenDialogItem(item);
      setOpenDialog(dialog);
    },
    hideDialog: () => {
      setOpenDialog("");
      setOpenDialogItem(null);
    },
  }

  useEffect(() => {
    // @ts-ignore
    ref.current = actions;
  }, [ref])

  const roles = [
    "owner",
    "editor",
    "reader",
    "commenter",
  ]


  const cid = openDialogItem?.id || "";

  const acctInfos: any[] = useQueries({
    queries: (openDialogItem?.relations || []).map((relation: any) => {
      const did = relation.relationship.subject.object.objectId.replaceAll("_", ":")
      if (did.startsWith("did:")) {
        return ({
          queryKey: [did, 'info'],
          queryFn: async () => {
            const r = await fetch(`https://plc.blebbit.dev/info/${did}`)

            return r.json()
          },
          staleTime: 5 * 60 * 1000,
          // enabled: !!(relation.relationship.subject.object.objectId)
          enabled: !!(openDialogItem?.relations && (openDialog === "share-page" || openDialog === "share-folder")),
        })
      } else {
        return ({
          queryKey: ["group", 'info'],
          queryFn: async () => {
            const g = await appBlebbitAuthrGroupGetGroup({
              id: did,
            })
            console.log("groupInfo queryFn", did, g)
            return g
          },
          staleTime: 5 * 60 * 1000,
          // enabled: !!(relation.relationship.subject.object.objectId)
          enabled: !!(openDialogItem?.relations && (openDialog === "share-page" || openDialog === "share-folder")),
        })
      }
    }),
  })



  const createPageRelation = useMutation({
    mutationFn: async ({id, relation}: {id: string, relation: string}) => {
      console.log("createPageRelation", cid, id, relation)
      return appBlebbitAuthrPageCreatePageRelationship({
        resource: cid,
        relation,
        subject: id,
      })
    },
    onSuccess: (data) => {
      console.log("createPageRelation.onSuccess", data)
      setTimeout(() => {
        console.log("createPageRelation.onSuccess.invalidateQueries", cid)
        queryClient.invalidateQueries({ queryKey:['pages', cid]})
      }, 3000)
    }
  })

  const updatePageRelation = useMutation({
    mutationFn: async ({id, relation}: {id: string, relation: string}) => {
      console.log("updatePageRelation", cid, id, relation)
      return appBlebbitAuthrPageUpdatePageRelationship({
        resource: cid,
        relation,
        subject: id,
      })
    },
    onSuccess: (data) => {
      console.log("updatePageRelation.onSuccess", data)
      setTimeout(() => {
        console.log("updatePageRelation.onSuccess.invalidateQueries", cid)
        queryClient.invalidateQueries({ queryKey:['pages', cid]})
      }, 2000)
    }
  })

  const deletePageRelation = useMutation({
    mutationFn: async ({id}: {id: string}) => {
      console.log("deletePageRelation", cid, id)
      return appBlebbitAuthrPageDeletePageRelationship({
        resource: cid,
        subject: id,
      })
    },
    onSuccess: (data) => {
      console.log("deletePageRelation.onSuccess", data)
      setTimeout(() => {
        console.log("deletePageRelation.onSuccess.invalidateQueries", cid)
        queryClient.invalidateQueries({ queryKey:['pages', cid]})
      }, 3000)
    }
  })

  const createFolderRelation = useMutation({
    mutationFn: async ({id, relation}: {id: string, relation: string}) => {
      console.log("createFolderRelation", cid, id, relation)
      return appBlebbitAuthrFolderCreateFolderRelationship({
        resource: cid,
        relation,
        subject: id,
      })
    },
    onSuccess: (data) => {
      console.log("createFolderRelation.onSuccess", data)
      setTimeout(() => {
        console.log("createFolderRelation.onSuccess.invalidateQueries", cid)
        queryClient.invalidateQueries({ queryKey:['pages', cid]})
      }, 3000)
    }
  })

  const updateFolderRelation = useMutation({
    mutationFn: async ({id, relation}: {id: string, relation: string}) => {
      console.log("updateFolderRelation", cid, id, relation)
      return appBlebbitAuthrFolderUpdateFolderRelationship({
        resource: cid,
        relation,
        subject: id,
      })
    },
    onSuccess: (data) => {
      console.log("updateFolderRelation.onSuccess", data)
      setTimeout(() => {
        console.log("updateFolderRelation.onSuccess.invalidateQueries", cid)
        queryClient.invalidateQueries({ queryKey:['pages', cid]})
      }, 2000)
    }
  })

  const deleteFolderRelation = useMutation({
    mutationFn: async ({id}: {id: string}) => {
      console.log("deleteFolderRelation", cid, id)
      return appBlebbitAuthrFolderDeleteFolderRelationship({
        resource: cid,
        subject: id,
      })
    },
    onSuccess: (data) => {
      console.log("deleteFolderRelation.onSuccess", data)
      setTimeout(() => {
        console.log("deleteFolderRelation.onSuccess.invalidateQueries", cid)
        queryClient.invalidateQueries({ queryKey:['pages', cid]})
      }, 3000)
    }
  })


  const dialogs = {
    "create-page": {
      title: "Create Page",
      description: "Create a new page in the selected location.",
      onSubmit: (name: string) => {
        createPage?.(openDialogItem?.id, name);
        actions.hideDialog();
      },
      content: () => {
        return (
          <form
						onSubmit={(e) => {
              e.stopPropagation();
              e.preventDefault();
              // @ts-ignore
              const name = e.currentTarget.name.value;
              console.log("Creating page with name:", name);
              dialogs["create-page"].onSubmit(name);
						}}
					>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" defaultValue="New Page" />
              </div>
              <Footer>
                <Button type="submit">Save changes</Button>
              </Footer>
            </div>
					</form> 
        )
      },
    },
    "rename-page": {
      title: "Rename Page",
      description: "Rename the selected page.",
      onSubmit: (name: string) => {
        renamePage?.(openDialogItem.id, name);
        actions.hideDialog();
      },
      content: () => {
        console.log("Renaming page:", openDialogItem);
        return (
          <form
						onSubmit={(e) => {
              e.stopPropagation();
              e.preventDefault();
              // @ts-ignore
              const name = e.currentTarget.name.value;
              console.log("Renaming page to:", name);
              dialogs["rename-page"].onSubmit(name);
						}}
					>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" defaultValue={openDialogItem?.value?.name} />
              </div>
              <Footer>
                <Button type="submit">Save Name</Button>
              </Footer>
            </div>
					</form> 
        )
      },
    },
    "delete-page": {
      title: "Are you absolutely sure?",
      description: "This action cannot be undone. This will permanently delete the page and all of its contents.",
      onSubmit: () => {
        deletePage?.(openDialogItem.id);
        actions.hideDialog();
      },
      content: () => {
        return (
          <Footer>
            <Button 
              variant="destructive"
              onClick={dialogs["delete-page"].onSubmit}
            >DELETE</Button>
          </Footer>
        )
      },
    },
    "share-page": {
      title: "Sharing",
      description: "Share this page with others.",
      // onSubmit: (subject: string) => createPageRelation?.(openDialogItem.id, subject, "reader"),
      content: () => {

        return (
          <>
            <Sharing addMember={createFolderRelation.mutate} />
            <PermissionTable
              roles={roles}
              relations={openDialogItem?.relations}
              memberInfos={acctInfos}
              createRelation={createPageRelation.mutate}
              updateRelation={updatePageRelation.mutate}
              deleteRelation={deletePageRelation.mutate}
            />
            <Footer />
          </>
        )
      },
    },

    "create-folder": {
      title: "Create Folder",
      description: "Create a new folder in the selected location.",
      onSubmit: (name: string) => {
        createFolder?.(openDialogItem.id, name);
        actions.hideDialog();
      },
      content: () => {
        return (
          <form
						onSubmit={(e) => {
              e.stopPropagation();
              e.preventDefault();
              // @ts-ignore
              const name = e.currentTarget.name.value;
              console.log("Creating folder with name:", name);
              dialogs["create-folder"].onSubmit(name);
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

        )
      },
    },
    "rename-folder": {
      title: "Rename Folder",
      description: "Rename the selected folder.",
      onSubmit: (name: string) => {
        renameFolder?.(openDialogItem.id, name);
        actions.hideDialog();
      },
      content: () => {
        return (
          <form
						onSubmit={(e) => {
              e.stopPropagation();
              e.preventDefault();
              // @ts-ignore
              const name = e.currentTarget.name.value;
              console.log("Renaming folder to:", name);
              dialogs["rename-folder"].onSubmit(name);
						}}
					>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" defaultValue={openDialogItem?.value?.name} />
              </div>
              <Footer>
                <Button type="submit">Save changes</Button>
              </Footer>
            </div>
					</form> 
        )
      },
    },
    "delete-folder": {
      title: "Are you absolutely sure?",
      description: "This action cannot be undone. This will permanently delete the folder and all of its contents.",
      onSubmit: () => {
        deleteFolder?.(openDialogItem.id);
        actions.hideDialog();
      },
      content: () => {
        return (
          <Footer>
            <Button 
              variant="destructive"
              onClick={dialogs["delete-folder"].onSubmit}
            >DELETE</Button>
          </Footer>
        )

      },
    },
    "share-folder": {
      title: "Sharing",
      description: "Share this folder with others.",
      content: () => {
        return (
          <>
            <Sharing addMember={createFolderRelation.mutate} />
            <PermissionTable
              roles={roles}
              relations={openDialogItem?.relations}
              memberInfos={acctInfos}
              createRelation={createFolderRelation.mutate}
              updateRelation={updateFolderRelation.mutate}
              deleteRelation={deleteFolderRelation.mutate}
            />
            <Footer />
          </>
        )
      },
    },
  }

  if (openDialogItem?.value && typeof openDialogItem?.value === "string") {
    try {
      openDialogItem.value = JSON.parse(openDialogItem.value);
    } catch (e) {
      console.error("Failed to parse openDialogItem.value as JSON:", e);
      openDialogItem.value = {};
    }
  }

  const dialog = dialogs[openDialog];

  // console.log("Dialog open state:", openDialog, openDialogItem, dialog);

  return (
    <div className="flex flex-col">

      {dialog && (
        <Dialog open={openDialog !== ""}
          onOpenChange={(open) => {
            console.log("Dialog open state changed:", open);
            if (!open) {
              actions.hideDialog();
            } else {
              actions.showDialog(null, openDialog, openDialogItem)
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dialog.title}</DialogTitle>
              <DialogDescription>{dialog.description}</DialogDescription>
            </DialogHeader>
            {dialog.content()}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}