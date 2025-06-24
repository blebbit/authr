import { xrpcCall } from "./call";

import {
  type APP_BLEBBIT_AUTHR_PAGE_CREATE_PAGE_INPUT,
  APP_BLEBBIT_AUTHR_PAGE_CREATE_PAGE_INPUT_SCHEMA,
  type APP_BLEBBIT_AUTHR_PAGE_CREATE_PAGE_OUTPUT,
  APP_BLEBBIT_AUTHR_PAGE_CREATE_PAGE_OUTPUT_SCHEMA,
} from "../../common-ts";

export async function appBlebbitAuthrPageCreatePage(
  payload: APP_BLEBBIT_AUTHR_PAGE_CREATE_PAGE_INPUT,
): Promise<APP_BLEBBIT_AUTHR_PAGE_CREATE_PAGE_OUTPUT | any> {
  // check payload
  const payloadCheck =
    APP_BLEBBIT_AUTHR_PAGE_CREATE_PAGE_INPUT_SCHEMA.safeParse(payload);
  if (!payloadCheck.success) {
    return payloadCheck.error.issues;
  }

  return xrpcCall({
    nsid: "app.blebbit.authr.page.createPage",
    method: "POST",
    payload,
  });
}
