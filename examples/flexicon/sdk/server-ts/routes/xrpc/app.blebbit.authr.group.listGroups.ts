import { type Context } from "hono";

import { type AuthzClient } from "authr-example-flexicon";

import {
  type APP_BLEBBIT_AUTHR_GROUP_LIST_GROUPS_PARAMETERS,
  APP_BLEBBIT_AUTHR_GROUP_LIST_GROUPS_PARAMETERS_SCHEMA,
  type APP_BLEBBIT_AUTHR_GROUP_LIST_GROUPS_OUTPUT,
} from "authr-example-flexicon";

export async function listGroups(c: Context) {
  console.log("GET /xrpc/app.blebbit.authr.group.listGroups");

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
    APP_BLEBBIT_AUTHR_GROUP_LIST_GROUPS_PARAMETERS_SCHEMA.safeParse(qs);
  if (!qResult.success) {
    return c.json(
      {
        errors: qResult.error.issues,
      },
      400,
    );
  }
  const params: APP_BLEBBIT_AUTHR_GROUP_LIST_GROUPS_PARAMETERS = qResult.data;

  // else case in template when no input schema is defined
  const input = undefined;

  const parent = input?.parent || reqDid;

  // list body
  const limit = params.limit || 10;
  const cursor = params.cursor || 0;
  console.log("listGroups.limit", limit);
  console.log("listGroups.cursor", cursor);
  console.log("NSID: app.blebbit.authr.group.listGroups");

  const authz = c.get("authzClient") as AuthzClient;
  // Lookup permissions using Authzed
  // we just look up them all for the current user for now
  // could probably use in an "IN" clause for SQL...
  // or we could use a spicedb bulk lookup

  const reqSubj = "user:" + reqDid.replaceAll(":", "_");
  console.log("listGroups.reqSubj", reqSubj);
  const reqPerms = await authz.getRelationship(`group`, undefined, reqSubj);
  console.log("listGroups.reqPerms", reqPerms);

  // need to account for cursor and limit still
  const dbRet = await c.env.DB.prepare(
    "SELECT * FROM records WHERE nsid = ? LIMIT ?",
  )
    .bind("app.blebbit.authr.group.record", limit)
    .all();

  var results = dbRet.results as any[];
  console.log("listGroups.results", results);

  if (reqDid) {
    var objs = results.map((group) => {
      return "group:" + group.id;
    });
    // make sure user has at least read permissions to the groups
    const permCheck = (await authz.checkBulkPermissions(
      objs,
      "read",
      reqSubj,
    )) as { pairs: any[] };
    console.log("listGroups.permCheck", JSON.stringify(permCheck, null, 2));

    results = results.filter((el, index) => {
      const perm = permCheck.pairs[index];
      // TODO, ensure we have the same id for each item
      return el.public || perm?.response?.item?.permissionship === 2;
    });
  }

  return c.json({
    groups: results,
    groupPerms: reqPerms,
    // groupSubjects,
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
    lname: group
    lplural: groups
defs:
    main:
        $authzed: read
        $flexicon:
            action: list
        output:
            encoding: application/json
            schema:
                properties:
                    groups:
                        items:
                            properties:
                                cuid:
                                    type: string
                                description:
                                    type: string
                                display:
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
description: get a group list
id: app.blebbit.authr.group.listGroups
lexicon: 1
revision: 1

*/
