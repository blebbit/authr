import { useEffect, useState } from "react";
import { useQuery, useQueries } from "@tanstack/react-query"

import {
  APP_BLEBBIT_AUTHR_FOLDER_RECORD_DOC,
} from "authr-example-flexicon/common-ts";

import { 
  appBlebbitAuthrFolderGetFolder,
  appBlebbitAuthrPageListPages,
  appBlebbitAuthrPageCreatePage,
  appBlebbitAuthrPageUpdatePage,
  appBlebbitAuthrPageDeletePage,
  appBlebbitAuthrFolderListFolders,
  appBlebbitAuthrFolderCreateFolder,
  appBlebbitAuthrFolderUpdateFolder,
  appBlebbitAuthrFolderDeleteFolder
} from "authr-example-flexicon/client-ts";


import { authrItemToTreeDataItem } from "@/lib/trans"

import { TreeView, type TreeDataItem } from '@/components/ui/tree-view';

import { NodeMenu, TreeMenu } from './menus';
import { Dialogs } from '@/components/widgets/dialogs';

const FolderTree = ({
  currItem,
  onSelectChange,
  dialogRef,
  account,
}:{
  currItem?: any,
  onSelectChange: (item: TreeDataItem) => void,
  dialogRef: React.RefObject<any | null>,
  account?: string,
}) => {
  const [tree, setTree] = useState<TreeDataItem[]>([]);
  const [treeItems, setTreeItems] = useState<string[]>(["root"]);

  // console.log("FolderTree.treeItems:", treeItems);

  const treeQuery = useQueries({
    queries: treeItems.map((id) => {
      return {
        queryKey: ['tree', id],
        queryFn: async () => {
          const opts = {};
          if (id && id !== "root") {
            opts['parent'] = id;
          }
          if (account) {
            opts['account'] = account;
          }
          const folders = await appBlebbitAuthrFolderListFolders(opts)
          const pages = await appBlebbitAuthrPageListPages(opts)

          const folderItems = folders?.folders.map(authrItemToTreeDataItem);
          const pageItems = pages?.pages.map(authrItemToTreeDataItem);

          const items = [...folderItems, ...pageItems];
          // console.log("Fetched items for tree:", id, items);

          setTree(prevTree => {
            var updatedTree: TreeDataItem[] = prevTree;
            for (const item of items) {
              updatedTree = recursiveUpdate(updatedTree, item);
            }
            // console.log("Updated tree:", updatedTree);
            return updatedTree;
          })

          return items
        },
        // staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
      }
    }),
  })

  const actions = {
    fetchChildren: async (item: TreeDataItem) => {
      if (item.nsid === APP_BLEBBIT_AUTHR_FOLDER_RECORD_DOC.id && !treeItems.includes(item.id)) {
        // console.log("fetchChildren.ITEM:", item.id);
        treeItems.push(item.id);
        setTreeItems([...treeItems]);
      }
    },
    createPage: async (parent: string, name: string) => {
      console.log("createPage.inputs:", parent, name);

      // actually create the page
      const resp = await appBlebbitAuthrPageCreatePage({
        name,
        parent,
      })

      // create the item for the tree
      const newPage: TreeDataItem = authrItemToTreeDataItem(resp);
      console.log("createPage.response:", resp, newPage);

      // update the tree
      const updatedTree = recursiveUpdate(tree, newPage);
      setTree(updatedTree);

      dialogRef.current?.hideDialog();
    },

    deletePage: async (id: string) => {
      console.log("deletePage.inputs:", id);
      // actually delete the page
      const resp = await appBlebbitAuthrPageDeletePage({
        id,
      })
      console.log("deletePage.response:", resp);

      const updatedTree = deleteItem(tree, id);
      setTree(updatedTree);
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

    createFolder: async (parent: string, name: string) => {
      console.log("createFolder.inputs:", parent, name);

      // actually create the folder
      const resp = await appBlebbitAuthrFolderCreateFolder({
        name,
        parent,
      })

      // create the item for the tree
      const newFolder: TreeDataItem = authrItemToTreeDataItem(resp);
      console.log("createFolder.response:", resp, newFolder);

      const updatedTree = recursiveUpdate(tree, newFolder);
      setTree(updatedTree);
      dialogRef.current?.hideDialog();
    },
    deleteFolder: async (id: string) => {
      console.log("deleteFolder.inputs:", id);
      // actually delete the page
      const resp = await appBlebbitAuthrFolderDeleteFolder({
        id,
      })
      console.log("deleteFolder.response:", resp);

      const updatedTree = deleteItem(tree, id);
      setTree(updatedTree);
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

  }

  const localOnSelectChange = async (currItem: TreeDataItem) => {
    // console.log("onSelectChange.item:", currItem);
    onSelectChange(currItem);
    await actions.fetchChildren(currItem);
  }

  const treedata = addActionsToData(tree, actions, dialogRef);

  return (
    <div className="flex flex-col">
      <TreeView
        data={treedata}
        onSelectChange={localOnSelectChange}
        // onDragEnd={(source, destination) => {
        //   console.log("onDragEnd", source, destination);
        //   // Handle drag and drop logic here
        // }}
      />
      <Dialogs 
        ref={dialogRef}
        {...actions}
      />
    </div>
  );
}

export default FolderTree;

const recursiveUpdate = (items: TreeDataItem[], newItem: TreeDataItem): TreeDataItem[] => {
  // console.log("recursiveUpdate.items:", items, "newItem:", newItem);
  // ensure the new folder has children, even if empty for now
  if (newItem.nsid === APP_BLEBBIT_AUTHR_FOLDER_RECORD_DOC.id) {
    if (!newItem.children) {
      newItem.children = []; // Ensure root folders have children array
    }
  }

  // no parent means it's a root item
  if (!newItem.parent || newItem.parent === "") {

    const childIndex = items.findIndex(child => child.id === newItem.id);
    // If the item already exists, update it
    if (childIndex !== -1) {
      const currItem = items[childIndex]
      if (currItem.children) {
        // TODO, merge the children by id
        newItem.children = currItem.children; // Preserve any existing children
      }
      items[childIndex] = newItem
    } else {
      items.push(newItem);
    }

    return items
  }

  return items.map(item => {
    if (item.id === newItem.id) {
      if (newItem.nsid === APP_BLEBBIT_AUTHR_FOLDER_RECORD_DOC.id) {
        // If the new item is a folder, preserve any children
        if (item.children) {
          // TODO, merge the children by id
          newItem.children = item.children;
        }
      }
      return newItem; 
    } else if (item.id === newItem.parent) {
      // if the item is the parent of the new item, update the children
      if (!item.children) {
        item.children = [];
      }
      // look for item in children
      const childIndex = item.children.findIndex(child => child.id === newItem.id);
      if (childIndex !== -1) {
        const currItem = item.children[childIndex];
        if (currItem.children) {
          // TODO, this should be unique
          newItem.children = currItem.children; // Preserve any existing children
        }
        item.children[childIndex] = newItem; // Update the existing item
      } else {
        // If the item is not found in children, add it
        item.children.push({
          ...newItem,
        });
      }

      return {
        ...item,
        children: item.children,
      };
    } else if (item.children) {
      return {
        ...item,
        children: recursiveUpdate(item.children, newItem),
      };
    } else {
      return item;
      // throw new Error(`Item with id ${newItem.id} could not be added to the tree`);
    }
  });
};

const deleteItem = (items: TreeDataItem[], id: string): TreeDataItem[] => {
  return items.reduce((acc: TreeDataItem[], item: TreeDataItem) => {
    if (item.id === id) {
      return acc; // Skip the item to delete
    }
    const newItem: TreeDataItem = { ...item };
    if (newItem.children) {
      newItem.children = deleteItem(newItem.children, id);
    }
    acc.push(newItem);
    return acc;
  }, []);
}

function addActionsToData(data: TreeDataItem[], actions: any, dialogRef: any): TreeDataItem[] {
  return data.map(item => {
    const newItem: TreeDataItem = {
      ...item,
      actions: <NodeMenu item={item} {...actions} dialogRef={dialogRef} />,
    };

    if (item.children) {
      newItem.children = addActionsToData(item.children, actions, dialogRef);
    }

    return newItem;
  })
}
