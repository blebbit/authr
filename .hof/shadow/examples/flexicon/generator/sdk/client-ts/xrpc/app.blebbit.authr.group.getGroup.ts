import { xrpcCall } from "./call";

import {
  type APP_BLEBBIT_AUTHR_GROUP_GET_GROUP_PARAMETERS,
  APP_BLEBBIT_AUTHR_GROUP_GET_GROUP_PARAMETERS_SCHEMA,
  type APP_BLEBBIT_AUTHR_GROUP_GET_GROUP_OUTPUT,
  APP_BLEBBIT_AUTHR_GROUP_GET_GROUP_OUTPUT_SCHEMA,
} from "../../common-ts";

export async function appBlebbitAuthrGroupGetGroup(
  params: APP_BLEBBIT_AUTHR_GROUP_GET_GROUP_PARAMETERS,
): Promise<APP_BLEBBIT_AUTHR_GROUP_GET_GROUP_OUTPUT | any> {
  // check params
  const paramsCheck =
    APP_BLEBBIT_AUTHR_GROUP_GET_GROUP_PARAMETERS_SCHEMA.safeParse(params);
  if (!paramsCheck.success) {
    return paramsCheck.error.issues;
  }

  return xrpcCall({
    nsid: "app.blebbit.authr.group.getGroup",
    method: "GET",
    params,
  });
}
