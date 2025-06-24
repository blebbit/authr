import { type Context } from "hono";

import { type AuthzClient } from "authr-example-flexicon";

import {
  type APP_BLEBBIT_AUTHR_PAGE_LIST_PAGES_PARAMETERS,
  APP_BLEBBIT_AUTHR_PAGE_LIST_PAGES_PARAMETERS_SCHEMA,
  type APP_BLEBBIT_AUTHR_PAGE_LIST_PAGES_OUTPUT,
} from "authr-example-flexicon";

export async function listPages(c: Context) {
  console.log("GET /xrpc/app.blebbit.authr.page.listPages");

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
    APP_BLEBBIT_AUTHR_PAGE_LIST_PAGES_PARAMETERS_SCHEMA.safeParse(qs);
  if (!qResult.success) {
    return c.json(
      {
        errors: qResult.error.issues,
      },
      400,
    );
  }
  const params: APP_BLEBBIT_AUTHR_PAGE_LIST_PAGES_PARAMETERS = qResult.data;

  // else case in template when no input schema is defined
  const input = undefined;

  const parent = input?.parent || reqDid;

  // list body
  const limit = params.limit || 10;
  const cursor = params.cursor || 0;
  console.log("listPages.limit", limit);
  console.log("listPages.cursor", cursor);
  console.log("NSID: app.blebbit.authr.page.listPages");

  const authz = c.get("authzClient") as AuthzClient;
  // Lookup permissions using Authzed
  // we just look up them all for the current user for now
  // could probably use in an "IN" clause for SQL...
  // or we could use a spicedb bulk lookup

  const reqSubj = "user:" + reqDid.replaceAll(":", "_");
  console.log("listPages.reqSubj", reqSubj);
  const reqPerms = await authz.getRelationship(`page`, undefined, reqSubj);
  console.log("listPages.reqPerms", reqPerms);

  // need to account for cursor and limit still
  const dbRet = await c.env.DB.prepare(
    "SELECT * FROM records WHERE nsid = ? LIMIT ?",
  )
    .bind("app.blebbit.authr.page.record", limit)
    .all();

  var results = dbRet.results as any[];
  console.log("listPages.results", results);

  if (reqDid) {
    var objs = results.map((page) => {
      return "page:" + page.id;
    });
    // make sure user has at least read permissions to the groups
    const permCheck = (await authz.checkBulkPermissions(
      objs,
      "read",
      reqSubj,
    )) as { pairs: any[] };
    console.log("listPages.permCheck", JSON.stringify(permCheck, null, 2));

    results = results.filter((el, index) => {
      const perm = permCheck.pairs[index];
      // TODO, ensure we have the same id for each item
      return el.public || perm?.response?.item?.permissionship === 2;
    });
  }

  return c.json({
    pages: results,
    pagePerms: reqPerms,
    // pageSubjects,
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
            action: list
        output:
            encoding: application/json
            schema:
                properties:
                    pages:
                        items:
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
                        type: array
                type: object
        parameters:
            properties:
                cursor:
                    type: string
                limit:
                    type: integer
            type: params
        type: query
description: get a page list
id: app.blebbit.authr.page.listPages
lexicon: 1
revision: 1

*/
