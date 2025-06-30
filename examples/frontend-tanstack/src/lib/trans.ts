import {
  APP_BLEBBIT_AUTHR_FOLDER_RECORD_DOC,
} from "authr-example-flexicon/common-ts";

export const authrItemToTreeDataItem = (item: any): any => {
  // start with a shallow copy of the item
  const newItem: any = {
    ...item,
  };

  // parse the value from JSON
  if (item.value) {
    if (typeof item.value === 'string' && item.value.startsWith('{')) {
      const value = JSON.parse(item.value || "{}");
      newItem["value"] = value;
    } else {
      newItem["value"] = item.value; // Keep it as is if it's not a JSON string
    }
  }

  // set TreeView specific properties
  if (!newItem.name) {
    newItem.name = newItem.value.name || newItem.id; // Fallback to title if name is not provided
  }
  if (!newItem.parent) {
    newItem.parent = newItem.value.parent || ''; // Fallback to title if name is not provided
  }

  if (item.nsid === APP_BLEBBIT_AUTHR_FOLDER_RECORD_DOC.id) {
    newItem.droppable = true; // Folders are droppable
    newItem.children = newItem.children || []; // Ensure children is an array
  }

  // console.log("New item created:", newItem);

  return newItem;
}
