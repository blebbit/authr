import { type Context } from "hono";

import { type AuthzClient } from "authr-example-flexicon/lib/authz";

import {
  type APP_BLEBBIT_AUTHR_GROUP_UPDATE_GROUP_PARAMETERS,
  APP_BLEBBIT_AUTHR_GROUP_UPDATE_GROUP_PARAMETERS_SCHEMA,
  type APP_BLEBBIT_AUTHR_GROUP_UPDATE_GROUP_INPUT,
  APP_BLEBBIT_AUTHR_GROUP_UPDATE_GROUP_INPUT_SCHEMA,
  type APP_BLEBBIT_AUTHR_GROUP_UPDATE_GROUP_OUTPUT,
} from "authr-example-flexicon";

import { updateRecord } from "authr-example-flexicon/lib/storage";

export async function updateGroup(c: Context) {
  console.log("POST /xrpc/app.blebbit.authr.group.updateGroup");

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
    APP_BLEBBIT_AUTHR_GROUP_UPDATE_GROUP_PARAMETERS_SCHEMA.safeParse(qs);
  if (!qResult.success) {
    return c.json(
      {
        errors: qResult.error.issues,
      },
      400,
    );
  }
  const params: APP_BLEBBIT_AUTHR_GROUP_UPDATE_GROUP_PARAMETERS = qResult.data;

  // check and parse input (json body)
  const iData = await c.req.json();
  const iResult =
    APP_BLEBBIT_AUTHR_GROUP_UPDATE_GROUP_INPUT_SCHEMA.safeParse(iData);
  if (!iResult.success) {
    return c.json(
      {
        errors: iResult.error.issues,
      },
      400,
    );
  }
  const input: APP_BLEBBIT_AUTHR_GROUP_UPDATE_GROUP_INPUT = iResult.data;

  // create body

  console.log("updateGroup.input", params, input);
  const authz = c.get("authzClient") as AuthzClient;

  const resId = `group:${params.id}`;
  const reqSubj = "user:" + reqDid.replaceAll(":", "_");

  const permCheck = (await authz.checkPermission(resId, "admin", reqSubj)) as {
    allowed: string;
  };
  console.log("updateGroup.permCheck", JSON.stringify(permCheck, null, 2));

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
    console.log("updateGroup.result", result);
  } catch (err) {
    console.error("updateGroup.createRecord", err);
    // delete relationship
  }

  try {
    // write to account's PDS
  } catch (err) {
    console.error("updateGroup.writeToPDS", err);
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
