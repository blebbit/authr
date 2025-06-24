import { type Context } from "hono";

import { type AuthzClient } from "authr-example-flexicon";

import {
  type APP_BLEBBIT_AUTHR_PAGE_DELETE_PAGE_PARAMETERS,
  APP_BLEBBIT_AUTHR_PAGE_DELETE_PAGE_PARAMETERS_SCHEMA,
} from "authr-example-flexicon";

export async function deletePage(c: Context) {
  console.log("POST /xrpc/app.blebbit.authr.page.deletePage");

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
    APP_BLEBBIT_AUTHR_PAGE_DELETE_PAGE_PARAMETERS_SCHEMA.safeParse(qs);
  if (!qResult.success) {
    return c.json(
      {
        errors: qResult.error.issues,
      },
      400,
    );
  }
  const params: APP_BLEBBIT_AUTHR_PAGE_DELETE_PAGE_PARAMETERS = qResult.data;

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
    lname: page
    lplural: pages
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
description: delete a page
id: app.blebbit.authr.page.deletePage
lexicon: 1
revision: 1

*/
