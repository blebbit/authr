import { type Context } from "hono";

import { type AuthzClient } from "authr-example-flexicon/lib/authz";

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

  // rel-list body

  return c.json(
    {
      error: "Not implemented",
    },
    501,
  );
}
