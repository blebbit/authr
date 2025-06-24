import { type Context } from "hono";

import { type AuthzClient } from "authr-example-flexicon";

import {
  type APP_BLEBBIT_AUTHR_PAGE_UPDATE_PAGE_PARAMETERS,
  APP_BLEBBIT_AUTHR_PAGE_UPDATE_PAGE_PARAMETERS_SCHEMA,
  type APP_BLEBBIT_AUTHR_PAGE_UPDATE_PAGE_INPUT,
  APP_BLEBBIT_AUTHR_PAGE_UPDATE_PAGE_INPUT_SCHEMA,
  type APP_BLEBBIT_AUTHR_PAGE_UPDATE_PAGE_OUTPUT,
} from "authr-example-flexicon";

export async function updatePage(c: Context) {
  console.log("POST /xrpc/app.blebbit.authr.page.updatePage");

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
    APP_BLEBBIT_AUTHR_PAGE_UPDATE_PAGE_PARAMETERS_SCHEMA.safeParse(qs);
  if (!qResult.success) {
    return c.json(
      {
        errors: qResult.error.issues,
      },
      400,
    );
  }
  const params: APP_BLEBBIT_AUTHR_PAGE_UPDATE_PAGE_PARAMETERS = qResult.data;

  // check and parse input (json body)
  const iData = await c.req.json();
  const iResult =
    APP_BLEBBIT_AUTHR_PAGE_UPDATE_PAGE_INPUT_SCHEMA.safeParse(iData);
  if (!iResult.success) {
    return c.json(
      {
        errors: iResult.error.issues,
      },
      400,
    );
  }
  const input: APP_BLEBBIT_AUTHR_PAGE_UPDATE_PAGE_INPUT = iResult.data;

  const parent = input?.parent || reqDid;

  // update body

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
            action: update
        input:
            encoding: application/json
            schema:
                properties:
                    name:
                        type: string
                    public:
                        type: boolean
                type: object
        output:
            encoding: application/json
            schema:
                properties:
                    content:
                        type: string
                    cuid:
                        type: string
                    name:
                        type: string
                    public:
                        type: boolean
                type: object
        parameters:
            properties:
                id:
                    type: string
            type: params
        type: procedure
description: update a page
id: app.blebbit.authr.page.updatePage
lexicon: 1
revision: 1

*/
