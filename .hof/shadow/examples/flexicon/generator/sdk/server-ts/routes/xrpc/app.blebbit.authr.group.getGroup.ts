import { type Context } from "hono";

import { type AuthzClient } from "authr-example-flexicon";

import {
  type APP_BLEBBIT_AUTHR_GROUP_GET_GROUP_PARAMETERS,
  APP_BLEBBIT_AUTHR_GROUP_GET_GROUP_PARAMETERS_SCHEMA,
  type APP_BLEBBIT_AUTHR_GROUP_GET_GROUP_OUTPUT,
} from "authr-example-flexicon";

export async function getGroup(c: Context) {
  console.log("GET /xrpc/app.blebbit.authr.group.getGroup");

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
    APP_BLEBBIT_AUTHR_GROUP_GET_GROUP_PARAMETERS_SCHEMA.safeParse(qs);
  if (!qResult.success) {
    return c.json(
      {
        errors: qResult.error.issues,
      },
      400,
    );
  }
  const params: APP_BLEBBIT_AUTHR_GROUP_GET_GROUP_PARAMETERS = qResult.data;

  // else case in template when no input schema is defined
  const input = undefined;

  const parent = input?.parent || reqDid;

  // get body
  const id = params.id;
  console.log("getGroup.id", id);
  const reqSubj = "user:" + reqDid.replaceAll(":", "_");
  const subjId = `group:${id}`;

  const authz = c.get("authzClient") as AuthzClient;
  // Check permissions using Authzed
  const reqPerm = await authz.getRelationship(subjId, undefined, undefined);
  console.log("getGroup.reqPerm", reqPerm);

  const dbRet = await c.env.DB.prepare(
    "SELECT * FROM records WHERE nsid = ? AND id = ? LIMIT 1",
  )
    .bind("app.blebbit.authr.group.record", id)
    .all();

  var results = dbRet.results as any[];
  console.log("getGroup.results", results);

  var result = undefined;

  if (reqDid && results.length > 0) {
    const permCheck = (await authz.checkPermission(
      subjId /*should be resourceId*/,
      "read",
      reqSubj,
    )) as { allowed: string };
    console.log("getGroup.permCheck", JSON.stringify(permCheck, null, 2));

    if (results[0].public || permCheck?.allowed === "yes") {
      result = results[0];
    }
  }

  // also condition on results and permissions
  const groupSubjects = await authz.lookupSubjects(subjId, "read", "user");

  return c.json({
    group: result,
    reqPerm,
    groupSubjects,
    groupRelations: reqPerm,
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
            action: get
        output:
            encoding: application/json
            schema:
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
        parameters:
            properties:
                id:
                    type: string
            required:
                - id
            type: params
        type: query
description: get a group by id
id: app.blebbit.authr.group.getGroup
lexicon: 1
revision: 1

*/
