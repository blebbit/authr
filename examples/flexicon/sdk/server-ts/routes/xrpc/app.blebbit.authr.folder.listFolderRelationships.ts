import { type Context } from "hono";

import { type AuthzClient } from "authr-example-flexicon";

import {
  type APP_BLEBBIT_AUTHR_FOLDER_LIST_FOLDER_RELATIONSHIPS_PARAMETERS,
  APP_BLEBBIT_AUTHR_FOLDER_LIST_FOLDER_RELATIONSHIPS_PARAMETERS_SCHEMA,
  type APP_BLEBBIT_AUTHR_FOLDER_LIST_FOLDER_RELATIONSHIPS_OUTPUT,
} from "authr-example-flexicon";

export async function listFolderRelationships(c: Context) {
  console.log("GET /xrpc/app.blebbit.authr.folder.listFolderRelationships");

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
    APP_BLEBBIT_AUTHR_FOLDER_LIST_FOLDER_RELATIONSHIPS_PARAMETERS_SCHEMA.safeParse(
      qs,
    );
  if (!qResult.success) {
    return c.json(
      {
        errors: qResult.error.issues,
      },
      400,
    );
  }
  const params: APP_BLEBBIT_AUTHR_FOLDER_LIST_FOLDER_RELATIONSHIPS_PARAMETERS =
    qResult.data;

  // else case in template when no input schema is defined
  const input = undefined;

  const parent = input?.parent || reqDid;

  // rel-list body

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
            action: rel-list
        output:
            encoding: application/json
            schema:
                properties:
                    folders:
                        items:
                            properties:
                                relation:
                                    type: string
                                resource:
                                    type: string
                                subject:
                                    type: string
                            type: object
                        type: array
                type: object
        parameters:
            properties:
                cursor:
                    type: string
                id:
                    type: string
                limit:
                    type: integer
            type: params
        type: query
description: get a list of relationships for a folder
id: app.blebbit.authr.folder.listFolderRelationships
lexicon: 1
revision: 1

*/
