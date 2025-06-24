import { Hono } from "hono";

import { getGroup } from "./app.blebbit.authr.group.getGroup.ts";
import { listGroups } from "./app.blebbit.authr.group.listGroups.ts";
import { createGroup } from "./app.blebbit.authr.group.createGroup.ts";
import { updateGroup } from "./app.blebbit.authr.group.updateGroup.ts";
import { deleteGroup } from "./app.blebbit.authr.group.deleteGroup.ts";
import { getPage } from "./app.blebbit.authr.page.getPage.ts";
import { listPages } from "./app.blebbit.authr.page.listPages.ts";
import { createPage } from "./app.blebbit.authr.page.createPage.ts";
import { updatePage } from "./app.blebbit.authr.page.updatePage.ts";
import { deletePage } from "./app.blebbit.authr.page.deletePage.ts";
import { listGroupRelationships } from "./app.blebbit.authr.group.listGroupRelationships.ts";
import { createGroupRelationship } from "./app.blebbit.authr.group.createGroupRelationship.ts";
import { updateGroupRelationship } from "./app.blebbit.authr.group.updateGroupRelationship.ts";
import { deleteGroupRelationship } from "./app.blebbit.authr.group.deleteGroupRelationship.ts";
import { listPageRelationships } from "./app.blebbit.authr.page.listPageRelationships.ts";
import { createPageRelationship } from "./app.blebbit.authr.page.createPageRelationship.ts";
import { updatePageRelationship } from "./app.blebbit.authr.page.updatePageRelationship.ts";
import { deletePageRelationship } from "./app.blebbit.authr.page.deletePageRelationship.ts";
import { getFolder } from "./app.blebbit.authr.folder.getFolder.ts";
import { listFolders } from "./app.blebbit.authr.folder.listFolders.ts";
import { createFolder } from "./app.blebbit.authr.folder.createFolder.ts";
import { updateFolder } from "./app.blebbit.authr.folder.updateFolder.ts";
import { deleteFolder } from "./app.blebbit.authr.folder.deleteFolder.ts";
import { listFolderRelationships } from "./app.blebbit.authr.folder.listFolderRelationships.ts";
import { createFolderRelationship } from "./app.blebbit.authr.folder.createFolderRelationship.ts";
import { updateFolderRelationship } from "./app.blebbit.authr.folder.updateFolderRelationship.ts";
import { deleteFolderRelationship } from "./app.blebbit.authr.folder.deleteFolderRelationship.ts";

export const xrpcRouter = new Hono();

xrpcRouter.get("/xrpc/app.blebbit.authr.group.getGroup", getGroup);
xrpcRouter.get("/xrpc/app.blebbit.authr.group.listGroups", listGroups);
xrpcRouter.post("/xrpc/app.blebbit.authr.group.createGroup", createGroup);
xrpcRouter.post("/xrpc/app.blebbit.authr.group.updateGroup", updateGroup);
xrpcRouter.post("/xrpc/app.blebbit.authr.group.deleteGroup", deleteGroup);
xrpcRouter.get("/xrpc/app.blebbit.authr.page.getPage", getPage);
xrpcRouter.get("/xrpc/app.blebbit.authr.page.listPages", listPages);
xrpcRouter.post("/xrpc/app.blebbit.authr.page.createPage", createPage);
xrpcRouter.post("/xrpc/app.blebbit.authr.page.updatePage", updatePage);
xrpcRouter.post("/xrpc/app.blebbit.authr.page.deletePage", deletePage);
xrpcRouter.get(
  "/xrpc/app.blebbit.authr.group.listGroupRelationships",
  listGroupRelationships,
);
xrpcRouter.post(
  "/xrpc/app.blebbit.authr.group.createGroupRelationship",
  createGroupRelationship,
);
xrpcRouter.post(
  "/xrpc/app.blebbit.authr.group.updateGroupRelationship",
  updateGroupRelationship,
);
xrpcRouter.post(
  "/xrpc/app.blebbit.authr.group.deleteGroupRelationship",
  deleteGroupRelationship,
);
xrpcRouter.get(
  "/xrpc/app.blebbit.authr.page.listPageRelationships",
  listPageRelationships,
);
xrpcRouter.post(
  "/xrpc/app.blebbit.authr.page.createPageRelationship",
  createPageRelationship,
);
xrpcRouter.post(
  "/xrpc/app.blebbit.authr.page.updatePageRelationship",
  updatePageRelationship,
);
xrpcRouter.post(
  "/xrpc/app.blebbit.authr.page.deletePageRelationship",
  deletePageRelationship,
);
xrpcRouter.get("/xrpc/app.blebbit.authr.folder.getFolder", getFolder);
xrpcRouter.get("/xrpc/app.blebbit.authr.folder.listFolders", listFolders);
xrpcRouter.post("/xrpc/app.blebbit.authr.folder.createFolder", createFolder);
xrpcRouter.post("/xrpc/app.blebbit.authr.folder.updateFolder", updateFolder);
xrpcRouter.post("/xrpc/app.blebbit.authr.folder.deleteFolder", deleteFolder);
xrpcRouter.get(
  "/xrpc/app.blebbit.authr.folder.listFolderRelationships",
  listFolderRelationships,
);
xrpcRouter.post(
  "/xrpc/app.blebbit.authr.folder.createFolderRelationship",
  createFolderRelationship,
);
xrpcRouter.post(
  "/xrpc/app.blebbit.authr.folder.updateFolderRelationship",
  updateFolderRelationship,
);
xrpcRouter.post(
  "/xrpc/app.blebbit.authr.folder.deleteFolderRelationship",
  deleteFolderRelationship,
);
