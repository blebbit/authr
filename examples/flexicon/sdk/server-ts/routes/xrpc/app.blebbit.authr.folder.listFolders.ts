import { type Context } from "hono";

import { type AuthzClient } from "authr-example-flexicon";

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

  const parent = input?.parent || reqDid;

  // list body
  const limit = params.limit || 10;
  const cursor = params.cursor || 0;
  console.log("listFolders.limit", limit);
  console.log("listFolders.cursor", cursor);
  console.log("NSID: app.blebbit.authr.folder.listFolders");

  const authz = c.get("authzClient") as AuthzClient;
  // Lookup permissions using Authzed
  // we just look up them all for the current user for now
  // could probably use in an "IN" clause for SQL...
  // or we could use a spicedb bulk lookup

  const reqSubj = "user:" + reqDid.replaceAll(":", "_");
  console.log("listFolders.reqSubj", reqSubj);
  const reqPerms = await authz.getRelationship(`folder`, undefined, reqSubj);
  console.log("listFolders.reqPerms", reqPerms);

  // need to account for cursor and limit still
  const dbRet = await c.env.DB.prepare(
    "SELECT * FROM records WHERE nsid = ? LIMIT ?",
  )
    .bind("app.blebbit.authr.folder.record", limit)
    .all();

  var results = dbRet.results as any[];
  console.log("listFolders.results", results);

  if (reqDid) {
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

/*
$flexicon:
    lname: folder
    lplural: folders
defs:
    main:
        $authzed: read
        $flexicon:
            action: list
        output:
            encoding: application/json
            schema:
                properties:
                    folders:
                        items:
                            properties:
                                cuid:
                                    type: string
                                name:
                                    type: string
                                public:
                                    type: boolean
                            type: object
                        type: array
                type: object
        parameters:
            properties:
                cursor:
                    type: string
                limit:
                    type: integer
            type: params
        type: query
description: get a folder list
id: app.blebbit.authr.folder.listFolders
lexicon: 1
revision: 1

*/
