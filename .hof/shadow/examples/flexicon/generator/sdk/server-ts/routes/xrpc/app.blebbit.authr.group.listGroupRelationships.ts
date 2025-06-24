import { type Context } from "hono";

import { type AuthzClient } from "authr-example-flexicon";

import {
  type APP_BLEBBIT_AUTHR_GROUP_LIST_GROUP_RELATIONSHIPS_PARAMETERS,
  APP_BLEBBIT_AUTHR_GROUP_LIST_GROUP_RELATIONSHIPS_PARAMETERS_SCHEMA,
  type APP_BLEBBIT_AUTHR_GROUP_LIST_GROUP_RELATIONSHIPS_OUTPUT,
} from "authr-example-flexicon";

export async function listGroupRelationships(c: Context) {
  console.log("GET /xrpc/app.blebbit.authr.group.listGroupRelationships");

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
    APP_BLEBBIT_AUTHR_GROUP_LIST_GROUP_RELATIONSHIPS_PARAMETERS_SCHEMA.safeParse(
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
  const params: APP_BLEBBIT_AUTHR_GROUP_LIST_GROUP_RELATIONSHIPS_PARAMETERS =
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
    lname: group
    lplural: groups
defs:
    main:
        $authzed: admin
        $flexicon:
            action: rel-list
        output:
            encoding: application/json
            schema:
                properties:
                    groups:
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
description: get a list of relationships for a group
id: app.blebbit.authr.group.listGroupRelationships
lexicon: 1
revision: 1

*/
