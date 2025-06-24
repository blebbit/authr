import { xrpcCall } from "./call";

import {
  type APP_BLEBBIT_AUTHR_GROUP_DELETE_GROUP_PARAMETERS,
  APP_BLEBBIT_AUTHR_GROUP_DELETE_GROUP_PARAMETERS_SCHEMA,
} from "../../common-ts";

export async function appBlebbitAuthrGroupDeleteGroup(
  params: APP_BLEBBIT_AUTHR_GROUP_DELETE_GROUP_PARAMETERS,
): Promise<any> {
  // check params
  const paramsCheck =
    APP_BLEBBIT_AUTHR_GROUP_DELETE_GROUP_PARAMETERS_SCHEMA.safeParse(params);
  if (!paramsCheck.success) {
    return paramsCheck.error.issues;
  }

  return xrpcCall({
    nsid: "app.blebbit.authr.group.deleteGroup",
    method: "POST",
    params,
  });
}
