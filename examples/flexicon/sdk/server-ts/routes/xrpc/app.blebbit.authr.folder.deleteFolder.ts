import { type Context } from "hono";

import { type AuthzClient } from "authr-example-flexicon/lib/authz";

import {
  type APP_BLEBBIT_AUTHR_FOLDER_DELETE_FOLDER_PARAMETERS,
  APP_BLEBBIT_AUTHR_FOLDER_DELETE_FOLDER_PARAMETERS_SCHEMA,
} from "authr-example-flexicon";

import { deleteRecord } from "authr-example-flexicon/lib/storage";

export async function deleteFolder(c: Context) {
  console.log("POST /xrpc/app.blebbit.authr.folder.deleteFolder");

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
    APP_BLEBBIT_AUTHR_FOLDER_DELETE_FOLDER_PARAMETERS_SCHEMA.safeParse(qs);
  if (!qResult.success) {
    return c.json(
      {
        errors: qResult.error.issues,
      },
      400,
    );
  }
  const params: APP_BLEBBIT_AUTHR_FOLDER_DELETE_FOLDER_PARAMETERS =
    qResult.data;

  // else case in template when no input schema is defined
  const input = undefined;

  // delete body
  const id = params.id;
  console.log("deleteFolder.id", id);
  const reqSubj = "user:" + reqDid.replaceAll(":", "_");
  const resId = `folder:${id}`;

  const authz = c.get("authzClient") as AuthzClient;
  // Check permissions using Authzed
  const reqPerm = await authz.getRelationship(resId, undefined, undefined);
  console.log("deleteFolder.reqPerm", reqPerm);

  const permCheck = (await authz.checkPermission(resId, "admin", reqSubj)) as {
    allowed: string;
  };
  console.log("deleteFolder.permCheck", JSON.stringify(permCheck, null, 2));

  if (permCheck.allowed !== "yes") {
    return c.json(
      {
        error: "Permission denied",
      },
      403,
    );
  }

  // delete from the record database
  const dbRet = await c.env.DB.prepare(
    "DELETE FROM records WHERE nsid = ? AND id = ? LIMIT 1",
  )
    .bind("app.blebbit.authr.folder.record", id)
    .all();

  var results = dbRet.results as any[];
  console.log("deleteFolder.results", results);

  // delete from the permissions database, hopefully this does not leave dangling permissions
  const deletePerm = await authz.deleteRelationship(
    resId,
    undefined,
    undefined,
  );
  console.log("deleteFolder.deletePerm", deletePerm);

  // delete from the permissions database

  // var result = undefined

  // if (reqDid && results.length > 0) {
  //   const permCheck = await authz.checkPermission(subjId/*should be resourceId*/, "admin", reqSubj) as { allowed: string }
  //   console.log("deleteFolder.permCheck", JSON.stringify(permCheck, null, 2))

  //   if( results[0].public || permCheck?.allowed === "yes" ){
  //     result = results[0]
  //   }

  // }

  // // also condition on results and permissions
  // const folderSubjects = await authz.lookupSubjects(subjId, 'read', "user")

  return c.json({
    folder: results,
    reqPerm,
    permCheck,
    deletePerm,
  });

  return c.json(
    {
      error: "Not implemented",
    },
    501,
  );
}
