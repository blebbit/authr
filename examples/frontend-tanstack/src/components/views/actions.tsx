import { 
  appBlebbitAuthrFolderGetFolder,
  appBlebbitAuthrPageListPages,
  appBlebbitAuthrPageCreatePage,
  appBlebbitAuthrPageUpdatePage,
  appBlebbitAuthrPageDeletePage,
  appBlebbitAuthrPageCreatePageRelationship,
  appBlebbitAuthrPageUpdatePageRelationship,
  appBlebbitAuthrPageDeletePageRelationship,

  appBlebbitAuthrFolderListFolders,
  appBlebbitAuthrFolderCreateFolder,
  appBlebbitAuthrFolderUpdateFolder,
  appBlebbitAuthrFolderDeleteFolder,
  appBlebbitAuthrFolderCreateFolderRelationship,
  appBlebbitAuthrFolderUpdateFolderRelationship,
  appBlebbitAuthrFolderDeleteFolderRelationship,
} from "authr-example-flexicon/client-ts";

export function createActions(dialogRef: any) {
  return {
    createPage: async (parent: string, name: string) => {
      console.log("createPage.inputs:", name, parent);

      // actually create the page
      const resp = await appBlebbitAuthrPageCreatePage({
        name,
        parent,
      })

      dialogRef.current?.hideDialog();
    },
    createFolder: async (parent: string, name: string) => {
      console.log("createFolder.inputs:", name, parent);

      // actually create the folder
      const resp = await appBlebbitAuthrFolderCreateFolder({
        name,
        parent,
      })

      dialogRef.current?.hideDialog();
    },
    renamePage: async (id: string, name: string) => {
      console.log("renamePage.inputs:", id, name);

      // rename the page
      const resp = await appBlebbitAuthrPageUpdatePage({
        id,
      },{
        name,
      })

      dialogRef.current?.hideDialog();
    },
    savePageContent: async (id: string, content: string) => {
      console.log("savePageContent.inputs:", id, content);

      // save the page content
      const resp = await appBlebbitAuthrPageUpdatePage({
        id,
      },{
        content,
      })

      dialogRef.current?.hideDialog();
    },
    createPageRelation: async (id: string, subject: string, role: string) => {
      console.log("createPageRelation.inputs:", id, subject, role);
      const resp = await appBlebbitAuthrPageCreatePageRelationship({
        subject,
        relation: role,
        resource: id,
      })

      dialogRef.current?.hideDialog();
    },

    deletePage: async (id: string) => {
      console.log("deletePage.inputs:", id);
      // actually delete the page
      const resp = await appBlebbitAuthrPageDeletePage({
        id,
      })

      dialogRef.current?.hideDialog();
    },
    deleteFolder: async (id: string) => {
      console.log("deleteFolder.inputs:", id);
      // actually delete the page
      const resp = await appBlebbitAuthrFolderDeleteFolder({
        id,
      })

      dialogRef.current?.hideDialog();
    },
    renameFolder: async (id: string, name: string) => {
      console.log("renameFolder.inputs:", id, name);

      // rename the folder
      const resp = await appBlebbitAuthrFolderUpdateFolder({
        id,
      },{
        name,
      })

      dialogRef.current?.hideDialog();
    },
    createFolderRelation: async (id: string, subject: string, role: string) => {
      console.log("createFolderRelation.inputs:", id, subject, role);
      const resp = await appBlebbitAuthrFolderCreateFolderRelationship({
        subject,
        relation: role,
        resource: id,
      })
      dialogRef.current?.hideDialog();
    },
  }

}