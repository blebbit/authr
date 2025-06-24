import { type Context } from "hono";

import { type AuthzClient } from "authr-example-flexicon";

import {
  type APP_BLEBBIT_AUTHR_PAGE_GET_PAGE_PARAMETERS,
  APP_BLEBBIT_AUTHR_PAGE_GET_PAGE_PARAMETERS_SCHEMA,
  type APP_BLEBBIT_AUTHR_PAGE_GET_PAGE_OUTPUT,
} from "authr-example-flexicon";

export async function getPage(c: Context) {
  console.log("GET /xrpc/app.blebbit.authr.page.getPage");

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
    APP_BLEBBIT_AUTHR_PAGE_GET_PAGE_PARAMETERS_SCHEMA.safeParse(qs);
  if (!qResult.success) {
    return c.json(
      {
        errors: qResult.error.issues,
      },
      400,
    );
  }
  const params: APP_BLEBBIT_AUTHR_PAGE_GET_PAGE_PARAMETERS = qResult.data;

  // else case in template when no input schema is defined
  const input = undefined;

  const parent = input?.parent || reqDid;

  // get body
  const id = params.id;
  console.log("getPage.id", id);
  const reqSubj = "user:" + reqDid.replaceAll(":", "_");
  const subjId = `page:${id}`;

  const authz = c.get("authzClient") as AuthzClient;
  // Check permissions using Authzed
  const reqPerm = await authz.getRelationship(subjId, undefined, undefined);
  console.log("getPage.reqPerm", reqPerm);

  const dbRet = await c.env.DB.prepare(
    "SELECT * FROM records WHERE nsid = ? AND id = ? LIMIT 1",
  )
    .bind("app.blebbit.authr.page.record", id)
    .all();

  var results = dbRet.results as any[];
  console.log("getPage.results", results);

  var result = undefined;

  if (reqDid && results.length > 0) {
    const permCheck = (await authz.checkPermission(
      subjId /*should be resourceId*/,
      "read",
      reqSubj,
    )) as { allowed: string };
    console.log("getPage.permCheck", JSON.stringify(permCheck, null, 2));

    if (results[0].public || permCheck?.allowed === "yes") {
      result = results[0];
    }
  }

  // also condition on results and permissions
  const pageSubjects = await authz.lookupSubjects(subjId, "read", "user");

  return c.json({
    page: result,
    reqPerm,
    pageSubjects,
    pageRelations: reqPerm,
  });

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
        $authzed: read
        $flexicon:
            action: get
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
            required:
                - id
            type: params
        type: query
description: get a page by id
id: app.blebbit.authr.page.getPage
lexicon: 1
revision: 1

*/
