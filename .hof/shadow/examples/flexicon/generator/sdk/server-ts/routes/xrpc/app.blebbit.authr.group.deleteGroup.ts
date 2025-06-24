import { type Context } from "hono";

import { type AuthzClient } from "authr-example-flexicon";

import {
  type APP_BLEBBIT_AUTHR_GROUP_DELETE_GROUP_PARAMETERS,
  APP_BLEBBIT_AUTHR_GROUP_DELETE_GROUP_PARAMETERS_SCHEMA,
} from "authr-example-flexicon";

export async function deleteGroup(c: Context) {
  console.log("POST /xrpc/app.blebbit.authr.group.deleteGroup");

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
    APP_BLEBBIT_AUTHR_GROUP_DELETE_GROUP_PARAMETERS_SCHEMA.safeParse(qs);
  if (!qResult.success) {
    return c.json(
      {
        errors: qResult.error.issues,
      },
      400,
    );
  }
  const params: APP_BLEBBIT_AUTHR_GROUP_DELETE_GROUP_PARAMETERS = qResult.data;

  // else case in template when no input schema is defined
  const input = undefined;

  const parent = input?.parent || reqDid;

  // delete body

  // Check permissions using Authzed

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
            action: delete
        parameters:
            properties:
                id:
                    type: string
            type: params
        type: procedure
description: delete a group
id: app.blebbit.authr.group.deleteGroup
lexicon: 1
revision: 1

*/
