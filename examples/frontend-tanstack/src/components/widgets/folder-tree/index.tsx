import { useRef, useState } from "react";
import { TreeView, type TreeDataItem } from '@/components/ui/tree-view';

import { NodeMenu, TreeMenu } from './menus';
import { Dialogs } from './dialogs';

import { data } from './example-data';
import { Input } from "@/components/ui/input";

const recursiveUpdate = (items: TreeDataItem[], parent: string, newItem: TreeDataItem): TreeDataItem[] => {
  return items.map(item => {
    if (item.id === parent) {
      return {
        ...item,
        children: [...(item.children || []), newItem],
      };
    }
    if (item.children) {
      return {
        ...item,
        children: recursiveUpdate(item.children, parent, newItem),
      };
    }
    return item;
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

export const FolderTree = ({
  onSelectChange
}:{
  onSelectChange: (item: TreeDataItem) => void
}) => {
  const [tree, setTree] = useState<TreeDataItem[]>(data);
  const dialogRef = useRef<any | null>(null);

  const actions = {
    createPage: (name: string, parent: string) => {
      const newPage: TreeDataItem = {
        id: Math.random().toString(36).substring(2, 15),
        name,
      };

      if (!parent || parent === "") {
        setTree(tree => [...tree, newPage]);
      } else {
        // Recursively update the tree
        const updatedTree = recursiveUpdate(tree, parent, newPage);
        setTree(updatedTree);

        dialogRef.current?.setOpenDialog("");
        dialogRef.current?.setOpenDialogItem("");
      }
    },

    createFolder: (name: string, parent: string) => {
      const newFolder: TreeDataItem = {
        id: Math.random().toString(36).substring(2, 15),
        name,
        droppable: true,
        children: [],
      };

      if (!parent || parent === "") {
        setTree(tree => [...tree, newFolder]);
      } else {
        // Recursively update the tree
        const updatedTree = recursiveUpdate(tree, parent, newFolder);
        setTree(updatedTree);

        dialogRef.current?.setOpenDialog("");
        dialogRef.current?.setOpenDialogItem("");
      }
    },

    deletePage: (id: string) => {
      const updatedTree = deleteItem(tree, id);
      setTree(updatedTree);
      dialogRef.current?.setOpenDialog("");
    },
    deleteFolder: (id: string) => {
      const updatedTree = deleteItem(tree, id);
      setTree(updatedTree);
      dialogRef.current?.setOpenDialog("");
    },
  }

  const treedata = addActionsToData(tree, actions, dialogRef);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row gap-2 p-1 justify-between items-center">
        {/* <Input placeholder="Search..." /> */}
        <span className="font-light text-lg">Your Pages</span>
        <TreeMenu 
          dialogRef={dialogRef}
        />
      </div>
      <TreeView
        data={treedata}
        initialSelectedItemId={tree.length > 0 ? tree[0].id : ""}
        onSelectChange={onSelectChange}
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