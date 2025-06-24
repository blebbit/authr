import { xrpcCall } from "./call";

import {
  type APP_BLEBBIT_AUTHR_PAGE_UPDATE_PAGE_PARAMETERS,
  APP_BLEBBIT_AUTHR_PAGE_UPDATE_PAGE_PARAMETERS_SCHEMA,
  type APP_BLEBBIT_AUTHR_PAGE_UPDATE_PAGE_INPUT,
  APP_BLEBBIT_AUTHR_PAGE_UPDATE_PAGE_INPUT_SCHEMA,
  type APP_BLEBBIT_AUTHR_PAGE_UPDATE_PAGE_OUTPUT,
  APP_BLEBBIT_AUTHR_PAGE_UPDATE_PAGE_OUTPUT_SCHEMA,
} from "../../common-ts";

export async function appBlebbitAuthrPageUpdatePage(
  params: APP_BLEBBIT_AUTHR_PAGE_UPDATE_PAGE_PARAMETERS,
  payload: APP_BLEBBIT_AUTHR_PAGE_UPDATE_PAGE_INPUT,
): Promise<APP_BLEBBIT_AUTHR_PAGE_UPDATE_PAGE_OUTPUT | any> {
  // check params
  const paramsCheck =
    APP_BLEBBIT_AUTHR_PAGE_UPDATE_PAGE_PARAMETERS_SCHEMA.safeParse(params);
  if (!paramsCheck.success) {
    return paramsCheck.error.issues;
  }

  // check payload
  const payloadCheck =
    APP_BLEBBIT_AUTHR_PAGE_UPDATE_PAGE_INPUT_SCHEMA.safeParse(payload);
  if (!payloadCheck.success) {
    return payloadCheck.error.issues;
  }

  return xrpcCall({
    nsid: "app.blebbit.authr.page.updatePage",
    method: "POST",
    params,
    payload,
  });
}
