import { type Context, Hono } from "hono";

const router = new Hono();

router.get("/xrpc/app.blebbit.authr.folder.getFolder", async (c: Context) => {
  console.log("GET /xrpc/app.blebbit.authr.folder.getFolder");
});

router.get("/xrpc/app.blebbit.authr.folder.listFolders", async (c: Context) => {
  console.log("GET /xrpc/app.blebbit.authr.folder.listFolders");
});

router.post(
  "/xrpc/app.blebbit.authr.folder.createFolder",
  async (c: Context) => {
    console.log("POST /xrpc/app.blebbit.authr.folder.createFolder");
  },
);

router.post(
  "/xrpc/app.blebbit.authr.folder.updateFolder",
  async (c: Context) => {
    console.log("POST /xrpc/app.blebbit.authr.folder.updateFolder");
  },
);

router.post(
  "/xrpc/app.blebbit.authr.folder.deleteFolder",
  async (c: Context) => {
    console.log("POST /xrpc/app.blebbit.authr.folder.deleteFolder");
  },
);

router.get("/xrpc/app.blebbit.authr.group.getGroup", async (c: Context) => {
  console.log("GET /xrpc/app.blebbit.authr.group.getGroup");
});

router.get("/xrpc/app.blebbit.authr.group.listGroups", async (c: Context) => {
  console.log("GET /xrpc/app.blebbit.authr.group.listGroups");
});

router.post("/xrpc/app.blebbit.authr.group.createGroup", async (c: Context) => {
  console.log("POST /xrpc/app.blebbit.authr.group.createGroup");
});

router.post("/xrpc/app.blebbit.authr.group.updateGroup", async (c: Context) => {
  console.log("POST /xrpc/app.blebbit.authr.group.updateGroup");
});

router.post("/xrpc/app.blebbit.authr.group.deleteGroup", async (c: Context) => {
  console.log("POST /xrpc/app.blebbit.authr.group.deleteGroup");
});

router.get("/xrpc/app.blebbit.authr.page.getPage", async (c: Context) => {
  console.log("GET /xrpc/app.blebbit.authr.page.getPage");
});

router.get("/xrpc/app.blebbit.authr.page.listPages", async (c: Context) => {
  console.log("GET /xrpc/app.blebbit.authr.page.listPages");
});

router.post("/xrpc/app.blebbit.authr.page.createPage", async (c: Context) => {
  console.log("POST /xrpc/app.blebbit.authr.page.createPage");
});

router.post("/xrpc/app.blebbit.authr.page.updatePage", async (c: Context) => {
  console.log("POST /xrpc/app.blebbit.authr.page.updatePage");
});

router.post("/xrpc/app.blebbit.authr.page.deletePage", async (c: Context) => {
  console.log("POST /xrpc/app.blebbit.authr.page.deletePage");
});

router.get(
  "/xrpc/app.blebbit.authr.folder.listFolderRelationships",
  async (c: Context) => {
    console.log("GET /xrpc/app.blebbit.authr.folder.listFolderRelationships");
  },
);

router.post(
  "/xrpc/app.blebbit.authr.folder.createFolderRelationship",
  async (c: Context) => {
    console.log("POST /xrpc/app.blebbit.authr.folder.createFolderRelationship");
  },
);

router.post(
  "/xrpc/app.blebbit.authr.folder.updateFolderRelationship",
  async (c: Context) => {
    console.log("POST /xrpc/app.blebbit.authr.folder.updateFolderRelationship");
  },
);

router.post(
  "/xrpc/app.blebbit.authr.folder.deleteFolderRelationship",
  async (c: Context) => {
    console.log("POST /xrpc/app.blebbit.authr.folder.deleteFolderRelationship");
  },
);

router.get(
  "/xrpc/app.blebbit.authr.group.typeAheadGroups",
  async (c: Context) => {
    console.log("GET /xrpc/app.blebbit.authr.group.typeAheadGroups");
  },
);

router.get(
  "/xrpc/app.blebbit.authr.group.listGroupRelationships",
  async (c: Context) => {
    console.log("GET /xrpc/app.blebbit.authr.group.listGroupRelationships");
  },
);

router.post(
  "/xrpc/app.blebbit.authr.group.createGroupRelationship",
  async (c: Context) => {
    console.log("POST /xrpc/app.blebbit.authr.group.createGroupRelationship");
  },
);

router.post(
  "/xrpc/app.blebbit.authr.group.updateGroupRelationship",
  async (c: Context) => {
    console.log("POST /xrpc/app.blebbit.authr.group.updateGroupRelationship");
  },
);

router.post(
  "/xrpc/app.blebbit.authr.group.deleteGroupRelationship",
  async (c: Context) => {
    console.log("POST /xrpc/app.blebbit.authr.group.deleteGroupRelationship");
  },
);

router.get(
  "/xrpc/app.blebbit.authr.page.listPageRelationships",
  async (c: Context) => {
    console.log("GET /xrpc/app.blebbit.authr.page.listPageRelationships");
  },
);

router.post(
  "/xrpc/app.blebbit.authr.page.createPageRelationship",
  async (c: Context) => {
    console.log("POST /xrpc/app.blebbit.authr.page.createPageRelationship");
  },
);

router.post(
  "/xrpc/app.blebbit.authr.page.updatePageRelationship",
  async (c: Context) => {
    console.log("POST /xrpc/app.blebbit.authr.page.updatePageRelationship");
  },
);

router.post(
  "/xrpc/app.blebbit.authr.page.deletePageRelationship",
  async (c: Context) => {
    console.log("POST /xrpc/app.blebbit.authr.page.deletePageRelationship");
  },
);

export default router;
