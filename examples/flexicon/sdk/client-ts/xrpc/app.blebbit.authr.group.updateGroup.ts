import { xrpcCall } from "./call";

import {
  type APP_BLEBBIT_AUTHR_GROUP_UPDATE_GROUP_PARAMETERS,
  APP_BLEBBIT_AUTHR_GROUP_UPDATE_GROUP_PARAMETERS_SCHEMA,
  type APP_BLEBBIT_AUTHR_GROUP_UPDATE_GROUP_INPUT,
  APP_BLEBBIT_AUTHR_GROUP_UPDATE_GROUP_INPUT_SCHEMA,
  type APP_BLEBBIT_AUTHR_GROUP_UPDATE_GROUP_OUTPUT,
  APP_BLEBBIT_AUTHR_GROUP_UPDATE_GROUP_OUTPUT_SCHEMA,
} from "../../common-ts";

export async function appBlebbitAuthrGroupUpdateGroup(
  params: APP_BLEBBIT_AUTHR_GROUP_UPDATE_GROUP_PARAMETERS,
  payload: APP_BLEBBIT_AUTHR_GROUP_UPDATE_GROUP_INPUT,
): Promise<APP_BLEBBIT_AUTHR_GROUP_UPDATE_GROUP_OUTPUT | any> {
  // check params
  const paramsCheck =
    APP_BLEBBIT_AUTHR_GROUP_UPDATE_GROUP_PARAMETERS_SCHEMA.safeParse(params);
  if (!paramsCheck.success) {
    return paramsCheck.error.issues;
  }

  // check payload
  const payloadCheck =
    APP_BLEBBIT_AUTHR_GROUP_UPDATE_GROUP_INPUT_SCHEMA.safeParse(payload);
  if (!payloadCheck.success) {
    return payloadCheck.error.issues;
  }

  return xrpcCall({
    nsid: "app.blebbit.authr.group.updateGroup",
    method: "POST",
    params,
    payload,
  });
}
