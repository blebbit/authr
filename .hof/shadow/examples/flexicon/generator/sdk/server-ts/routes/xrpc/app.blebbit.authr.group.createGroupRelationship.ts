import { type Context } from "hono";

import { type AuthzClient } from "authr-example-flexicon/lib/authz";

import {
  type APP_BLEBBIT_AUTHR_GROUP_CREATE_GROUP_RELATIONSHIP_INPUT,
  APP_BLEBBIT_AUTHR_GROUP_CREATE_GROUP_RELATIONSHIP_INPUT_SCHEMA,
} from "authr-example-flexicon";

export async function createGroupRelationship(c: Context) {
  console.log("POST /xrpc/app.blebbit.authr.group.createGroupRelationship");

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
    APP_BLEBBIT_AUTHR_GROUP_CREATE_GROUP_RELATIONSHIP_INPUT_SCHEMA.safeParse(
      iData,
    );
  if (!iResult.success) {
    return c.json(
      {
        errors: iResult.error.issues,
      },
      400,
    );
  }
  const input: APP_BLEBBIT_AUTHR_GROUP_CREATE_GROUP_RELATIONSHIP_INPUT =
    iResult.data;

  // rel-create body

  // unpack the payload
  console.log("createGroupRelationship.input", input);

  const reqSubj = "user:" + reqDid.replaceAll(":", "_");
  const resource = `group:${input.resource}`;
  var subject = "";
  if (input.subject.startsWith("did:")) {
    subject = `user:${input.subject.replaceAll(":", "_")}`;
  } else {
    subject = `group:${input.subject}#member`;
  }

  // look for the group in the database
  const dbRet = await c.env.DB.prepare(
    "SELECT * FROM records WHERE nsid = ? AND id = ? LIMIT 1",
  )
    .bind("app.blebbit.authr.group.record", input.resource)
    .all();

  const results = dbRet.results as any[];
  console.log("createGroupRelationship.results", results);

  if (results.length === 0) {
    return c.json(
      {
        error: "group not found",
      },
      404,
    );
  }

  // check if has the permission to add a relationship
  const authz = c.get("authzClient") as AuthzClient;
  const permCheck = (await authz.checkPermission(
    resource,
    "admin",
    reqSubj,
  )) as { allowed: string };
  console.log(
    "createGroupRelationship.permCheck",
    JSON.stringify(permCheck, null, 2),
  );

  if (permCheck?.allowed !== "yes") {
    return c.json(
      {
        error:
          "You do not have required permission (admin) to modify relationships",
      },
      403,
    );
  }

  // create the relationship
  try {
    console.log(
      "createGroupRelationship.permPayload",
      resource,
      input.relation,
      subject,
    );
    // write resource and assign owner to creator
    const perm = await authz.createRelationship(
      resource,
      input.relation,
      subject,
    );
    console.log("createGroupRelationship.perm", perm);
    return c.json({
      group: results[0],
      perm,
    });
  } catch (err) {
    console.error("createGroupRelationship.createRelationship", err);
    return c.json(
      {
        error: "Failed to create relationship",
      },
      500,
    );
  }

  return c.json(
    {
      error: "Not implemented",
    },
    501,
  );
}
