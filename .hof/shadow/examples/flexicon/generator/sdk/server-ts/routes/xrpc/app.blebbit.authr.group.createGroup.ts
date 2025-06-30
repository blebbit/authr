import { type Context } from "hono";

import { type AuthzClient } from "authr-example-flexicon/lib/authz";

import {
  type APP_BLEBBIT_AUTHR_GROUP_CREATE_GROUP_INPUT,
  APP_BLEBBIT_AUTHR_GROUP_CREATE_GROUP_INPUT_SCHEMA,
  type APP_BLEBBIT_AUTHR_GROUP_CREATE_GROUP_OUTPUT,
} from "authr-example-flexicon";

import { createRecord } from "authr-example-flexicon/lib/storage";
import { createId } from "@paralleldrive/cuid2";

export async function createGroup(c: Context) {
  console.log("POST /xrpc/app.blebbit.authr.group.createGroup");

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

  // check and parse input (json body)
  const iData = await c.req.json();
  const iResult =
    APP_BLEBBIT_AUTHR_GROUP_CREATE_GROUP_INPUT_SCHEMA.safeParse(iData);
  if (!iResult.success) {
    return c.json(
      {
        errors: iResult.error.issues,
      },
      400,
    );
  }
  const input: APP_BLEBBIT_AUTHR_GROUP_CREATE_GROUP_INPUT = iResult.data;

  // create body

  console.log("createGroup.input", input);
  const authz = c.get("authzClient") as AuthzClient;

  const reqSubj = "user:" + reqDid.replaceAll(":", "_");
  const cuid = createId();
  var result: any;
  var perm: any;
  // TODO, create cid hash of record

  try {
    console.log("createGroup.cuid", cuid);
    // write resource and assign owner to creator
    perm = await authz.createRelationship("group:" + cuid, "owner", reqSubj);
    console.log("createGroup.perm.owner", perm);

    // TODO, if parent, create relationship to parent
    if (input.parent) {
      const pperm = await authz.createRelationship(
        "group:" + cuid,
        "parent",
        ":" + input.parent,
      );
      console.log("createGroup.perm.parent", pperm);
    }
  } catch (err) {
    console.error("createGroup.createRelationship", err);
  }

  try {
    // write to application database
    result = await createRecord(
      c,
      cuid,
      reqDid,
      "app.blebbit.authr.group.record",
      input,
      input.public || false,
    );
    console.log("createGroup.result", result);
  } catch (err) {
    console.error("createGroup.createRecord", err);
    // delete all relationships
    perm = await authz.deleteRelationship(
      "group:" + cuid,
      undefined,
      undefined,
    );
    console.log("createGroup.perm CLEANUP", perm);
  }

  try {
    // write to account's PDS
  } catch (err) {
    console.error("createGroup.writeToPDS", err);
    // we have the record and permission, we should retry in the background (with pg-boss)
  }

  return c.json({
    ...result,
    cuid,
    perm,
  });

  return c.json(
    {
      error: "Not implemented",
    },
    501,
  );
}
