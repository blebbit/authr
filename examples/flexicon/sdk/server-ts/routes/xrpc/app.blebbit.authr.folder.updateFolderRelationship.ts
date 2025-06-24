import { type Context } from "hono";

import { type AuthzClient } from "authr-example-flexicon";

import {
  type APP_BLEBBIT_AUTHR_FOLDER_UPDATE_FOLDER_RELATIONSHIP_INPUT,
  APP_BLEBBIT_AUTHR_FOLDER_UPDATE_FOLDER_RELATIONSHIP_INPUT_SCHEMA,
} from "authr-example-flexicon";

export async function updateFolderRelationship(c: Context) {
  console.log("POST /xrpc/app.blebbit.authr.folder.updateFolderRelationship");

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
    APP_BLEBBIT_AUTHR_FOLDER_UPDATE_FOLDER_RELATIONSHIP_INPUT_SCHEMA.safeParse(
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
  const input: APP_BLEBBIT_AUTHR_FOLDER_UPDATE_FOLDER_RELATIONSHIP_INPUT =
    iResult.data;

  const parent = input?.parent || reqDid;

  // rel-update body

  // unpack the payload
  console.log("addGroupMember.input", input);

  const reqSubj = "user:" + reqDid.replaceAll(":", "_");
  const resource = `folder:${input.resource}`;
  const subject = `user:${input.subject.replaceAll(":", "_")}`;

  // look for the folder in the database
  const dbRet = await c.env.DB.prepare(
    "SELECT * FROM records WHERE nsid = ? AND id = ? LIMIT 1",
  )
    .bind("app.blebbit.authr.folder.record", input.resource)
    .all();

  const results = dbRet.results as any[];
  console.log("updateFolderRelationship.results", results);

  if (results.length === 0) {
    return c.json(
      {
        error: "folder not found",
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
    "updateFolderRelationship.permCheck",
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
    // write resource and assign owner to creator
    const perm = await authz.updateRelationship(
      resource,
      input.relation,
      subject,
    );
    console.log("updateFolderRelationship.perm", perm);
    return c.json({
      folder: results[0],
      perm,
    });
  } catch (err) {
    console.error("updateFolderRelationship.createRelationship", err);
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

/*
$flexicon:
    lname: folder
    lplural: folders
defs:
    main:
        $authzed: admin
        $flexicon:
            action: rel-update
        input:
            encoding: application/json
            schema:
                properties:
                    relation:
                        type: string
                    resource:
                        type: string
                    subject:
                        type: string
                required:
                    - subject
                    - relation
                    - resource
                type: object
        type: procedure
description: update a relationship for folder
id: app.blebbit.authr.folder.updateFolderRelationship
lexicon: 1
revision: 1

*/
