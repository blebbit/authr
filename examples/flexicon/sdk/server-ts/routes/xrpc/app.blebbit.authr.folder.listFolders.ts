import { type Context } from "hono";

import { type AuthzClient } from "authr-example-flexicon/lib/authz";

import {
  type APP_BLEBBIT_AUTHR_FOLDER_LIST_FOLDERS_PARAMETERS,
  APP_BLEBBIT_AUTHR_FOLDER_LIST_FOLDERS_PARAMETERS_SCHEMA,
  type APP_BLEBBIT_AUTHR_FOLDER_LIST_FOLDERS_OUTPUT,
} from "authr-example-flexicon";

export async function listFolders(c: Context) {
  console.log("GET /xrpc/app.blebbit.authr.folder.listFolders");

  // get session information and requesting DID
  const authrSession = c.get("authrSession");
  const pdsSession = c.get("pdsSession");
  const session = authrSession || pdsSession || undefined;
  const reqDid = session?.did || undefined;

  if (!session) {
    return c.json(
      {
        error: "Unauthorized",
      },
      401,
    );
  }

  // check and parse query parameters
  const qs: any = c.req.query();
  const qResult =
    APP_BLEBBIT_AUTHR_FOLDER_LIST_FOLDERS_PARAMETERS_SCHEMA.safeParse(qs);
  if (!qResult.success) {
    return c.json(
      {
        errors: qResult.error.issues,
      },
      400,
    );
  }
  const params: APP_BLEBBIT_AUTHR_FOLDER_LIST_FOLDERS_PARAMETERS = qResult.data;

  // else case in template when no input schema is defined
  const input = undefined;

  // list body
  console.log("listFolders.list params", params);

  const account = params.account || undefined;
  const limit = params.limit || 10;
  const cursor = params.cursor;
  const parent = params.parent || "";

  const authz = c.get("authzClient") as AuthzClient;
  const reqSubj = "user:" + reqDid.replaceAll(":", "_");
  const reqPerms = await authz.getRelationship(`folder`, undefined, reqSubj);
  console.log("listFolders.reqPerms", reqPerms);

  // results we build up
  var results: any[] = [];
  // if auth'd, filter by permissions, otherwise just return public records
  if (reqDid) {
    // need to account for cursor and limit still
    // need to loop until we reach limit or end of results (after filtering for permisssions)
    const dbRet = await c.env.DB.prepare(
      "SELECT * FROM records WHERE nsid = ? AND parent = ? LIMIT ?",
    )
      .bind("app.blebbit.authr.folder.record", parent, limit)
      .all();

    results = dbRet.results as any[];
    console.log("listFolders.results", results);

    var objs = results.map((folder) => {
      return "folder:" + folder.id;
    });
    // make sure user has at least read permissions to the groups
    const permCheck = (await authz.checkBulkPermissions(
      objs,
      "read",
      reqSubj,
    )) as { pairs: any[] };
    console.log("listFolders.permCheck", JSON.stringify(permCheck, null, 2));

    results = results.filter((el, index) => {
      const perm = permCheck.pairs[index];
      // TODO, ensure we have the same id for each item
      return el.public || perm?.response?.item?.permissionship === 2;
    });
  } else {
    // need to account for cursor and limit still
    const dbRet = await c.env.DB.prepare(
      "SELECT * FROM records WHERE nsid = ? AND parent = ? AND public = 1 LIMIT ?",
    )
      .bind("app.blebbit.authr.folder.record", parent, cursor, limit)
      .all();

    results = dbRet.results as any[];
  }

  return c.json({
    folders: results,
    folderPerms: reqPerms,
    // folderSubjects,
  });

  return c.json(
    {
      error: "Not implemented",
    },
    501,
  );
}
