import { xrpcCall } from "./call";

import {
  type APP_BLEBBIT_AUTHR_GROUP_CREATE_GROUP_INPUT,
  APP_BLEBBIT_AUTHR_GROUP_CREATE_GROUP_INPUT_SCHEMA,
  type APP_BLEBBIT_AUTHR_GROUP_CREATE_GROUP_OUTPUT,
  APP_BLEBBIT_AUTHR_GROUP_CREATE_GROUP_OUTPUT_SCHEMA,
} from "../../common-ts";

export async function appBlebbitAuthrGroupCreateGroup(
  payload: APP_BLEBBIT_AUTHR_GROUP_CREATE_GROUP_INPUT,
): Promise<APP_BLEBBIT_AUTHR_GROUP_CREATE_GROUP_OUTPUT | any> {
  // check payload
  const payloadCheck =
    APP_BLEBBIT_AUTHR_GROUP_CREATE_GROUP_INPUT_SCHEMA.safeParse(payload);
  if (!payloadCheck.success) {
    return payloadCheck.error.issues;
  }

  return xrpcCall({
    nsid: "app.blebbit.authr.group.createGroup",
    method: "POST",
    payload,
  });
}
