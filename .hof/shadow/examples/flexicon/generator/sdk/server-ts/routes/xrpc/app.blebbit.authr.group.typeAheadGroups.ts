import { type Context } from "hono";

import { type AuthzClient } from "authr-example-flexicon/lib/authz";

import {
  type APP_BLEBBIT_AUTHR_GROUP_TYPE_AHEAD_GROUPS_PARAMETERS,
  APP_BLEBBIT_AUTHR_GROUP_TYPE_AHEAD_GROUPS_PARAMETERS_SCHEMA,
  type APP_BLEBBIT_AUTHR_GROUP_TYPE_AHEAD_GROUPS_OUTPUT,
} from "authr-example-flexicon";

export async function typeAheadGroups(c: Context) {
  console.log("GET /xrpc/app.blebbit.authr.group.typeAheadGroups");

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
    APP_BLEBBIT_AUTHR_GROUP_TYPE_AHEAD_GROUPS_PARAMETERS_SCHEMA.safeParse(qs);
  if (!qResult.success) {
    return c.json(
      {
        errors: qResult.error.issues,
      },
      400,
    );
  }
  const params: APP_BLEBBIT_AUTHR_GROUP_TYPE_AHEAD_GROUPS_PARAMETERS =
    qResult.data;

  // else case in template when no input schema is defined
  const input = undefined;

  // type-ahead body
  console.log("typeAheadGroups.type-ahead params", params);

  const account = params.account || undefined;
  const limit = params.limit || 10;
  const cursor = params.cursor;
  const parent = params.parent || "";
  const prefix = params.prefix || "";
  const accountDid = params.account || reqDid;

  const authz = c.get("authzClient") as AuthzClient;
  const reqSubj = "user:" + reqDid.replaceAll(":", "_");
  const reqPerms = await authz.getRelationship(`group`, undefined, reqSubj);
  console.log("typeAheadGroups.reqPerms", reqPerms);

  // results we build up
  var results: any[] = [];
  // if auth'd, filter by permissions, otherwise just return public records
  if (reqDid) {
    // need to account for cursor and limit still
    // need to loop until we reach limit or end of results (after filtering for permisssions)
    const dbRet = await c.env.DB.prepare(
      'SELECT * FROM records WHERE acct = ? AND nsid = ? AND parent = ? AND value ->> "$.name" LIKE ? LIMIT ?',
    )
      .bind(
        accountDid,
        "app.blebbit.authr.group.record",
        parent,
        prefix + "%",
        limit,
      )
      .all();

    results = dbRet.results as any[];
    console.log("typeAheadGroups.results", results);

    var objs = results.map((group) => {
      return "group:" + group.id;
    });
    // make sure user has at least read permissions to the groups
    const permCheck = (await authz.checkBulkPermissions(
      objs,
      "read",
      reqSubj,
    )) as { pairs: any[] };
    console.log(
      "typeAheadGroups.permCheck",
      JSON.stringify(permCheck, null, 2),
    );

    results = results.filter((el, index) => {
      const perm = permCheck.pairs[index];
      // TODO, ensure we have the same id for each item
      return el.public || perm?.response?.item?.permissionship === 2;
    });
  } else {
    // need to account for cursor and limit still
    const dbRet = await c.env.DB.prepare(
      "SELECT * FROM records WHERE nsid = ? AND parent = ? AND public = 1 LIMIT ?",
    )
      .bind("app.blebbit.authr.group.record", parent, cursor, limit)
      .all();

    results = dbRet.results as any[];
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
