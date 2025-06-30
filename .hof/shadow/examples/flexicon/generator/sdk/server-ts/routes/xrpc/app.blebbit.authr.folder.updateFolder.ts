import { type Context } from "hono";

import { type AuthzClient } from "authr-example-flexicon/lib/authz";

import {
  type APP_BLEBBIT_AUTHR_FOLDER_UPDATE_FOLDER_PARAMETERS,
  APP_BLEBBIT_AUTHR_FOLDER_UPDATE_FOLDER_PARAMETERS_SCHEMA,
  type APP_BLEBBIT_AUTHR_FOLDER_UPDATE_FOLDER_INPUT,
  APP_BLEBBIT_AUTHR_FOLDER_UPDATE_FOLDER_INPUT_SCHEMA,
  type APP_BLEBBIT_AUTHR_FOLDER_UPDATE_FOLDER_OUTPUT,
} from "authr-example-flexicon";

import { updateRecord } from "authr-example-flexicon/lib/storage";

export async function updateFolder(c: Context) {
  console.log("POST /xrpc/app.blebbit.authr.folder.updateFolder");

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
    APP_BLEBBIT_AUTHR_FOLDER_UPDATE_FOLDER_PARAMETERS_SCHEMA.safeParse(qs);
  if (!qResult.success) {
    return c.json(
      {
        errors: qResult.error.issues,
      },
      400,
    );
  }
  const params: APP_BLEBBIT_AUTHR_FOLDER_UPDATE_FOLDER_PARAMETERS =
    qResult.data;

  // check and parse input (json body)
  const iData = await c.req.json();
  const iResult =
    APP_BLEBBIT_AUTHR_FOLDER_UPDATE_FOLDER_INPUT_SCHEMA.safeParse(iData);
  if (!iResult.success) {
    return c.json(
      {
        errors: iResult.error.issues,
      },
      400,
    );
  }
  const input: APP_BLEBBIT_AUTHR_FOLDER_UPDATE_FOLDER_INPUT = iResult.data;

  // create body

  console.log("updateFolder.input", params, input);
  const authz = c.get("authzClient") as AuthzClient;

  const resId = `folder:${params.id}`;
  const reqSubj = "user:" + reqDid.replaceAll(":", "_");

  const permCheck = (await authz.checkPermission(resId, "admin", reqSubj)) as {
    allowed: string;
  };
  console.log("updateFolder.permCheck", JSON.stringify(permCheck, null, 2));

  if (permCheck.allowed !== "yes") {
    return c.json(
      {
        error: "Permission denied",
      },
      403,
    );
  }

  var result: any;

  try {
    // write to application database
    result = await updateRecord(c, params.id, input, {});
    console.log("updateFolder.result", result);
  } catch (err) {
    console.error("updateFolder.createRecord", err);
    // delete relationship
  }

  try {
    // write to account's PDS
  } catch (err) {
    console.error("updateFolder.writeToPDS", err);
    // we have the record and permission, we should retry in the background (with pg-boss)
  }

  return c.json({
    ...result,
  });

  return c.json(
    {
      error: "Not implemented",
    },
    501,
  );
}
