import { xrpcCall } from "./call";

import {
  type APP_BLEBBIT_AUTHR_GROUP_LIST_GROUPS_PARAMETERS,
  APP_BLEBBIT_AUTHR_GROUP_LIST_GROUPS_PARAMETERS_SCHEMA,
  type APP_BLEBBIT_AUTHR_GROUP_LIST_GROUPS_OUTPUT,
  APP_BLEBBIT_AUTHR_GROUP_LIST_GROUPS_OUTPUT_SCHEMA,
} from "../../common-ts";

export async function appBlebbitAuthrGroupListGroups(
  params: APP_BLEBBIT_AUTHR_GROUP_LIST_GROUPS_PARAMETERS,
): Promise<APP_BLEBBIT_AUTHR_GROUP_LIST_GROUPS_OUTPUT | any> {
  // check params
  const paramsCheck =
    APP_BLEBBIT_AUTHR_GROUP_LIST_GROUPS_PARAMETERS_SCHEMA.safeParse(params);
  if (!paramsCheck.success) {
    return paramsCheck.error.issues;
  }

  return xrpcCall({
    nsid: "app.blebbit.authr.group.listGroups",
    method: "GET",
    params,
  });
}
