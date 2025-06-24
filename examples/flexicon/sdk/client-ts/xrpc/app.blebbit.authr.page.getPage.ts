import { xrpcCall } from "./call";

import {
  type APP_BLEBBIT_AUTHR_PAGE_GET_PAGE_PARAMETERS,
  APP_BLEBBIT_AUTHR_PAGE_GET_PAGE_PARAMETERS_SCHEMA,
  type APP_BLEBBIT_AUTHR_PAGE_GET_PAGE_OUTPUT,
  APP_BLEBBIT_AUTHR_PAGE_GET_PAGE_OUTPUT_SCHEMA,
} from "../../common-ts";

export async function appBlebbitAuthrPageGetPage(
  params: APP_BLEBBIT_AUTHR_PAGE_GET_PAGE_PARAMETERS,
): Promise<APP_BLEBBIT_AUTHR_PAGE_GET_PAGE_OUTPUT | any> {
  // check params
  const paramsCheck =
    APP_BLEBBIT_AUTHR_PAGE_GET_PAGE_PARAMETERS_SCHEMA.safeParse(params);
  if (!paramsCheck.success) {
    return paramsCheck.error.issues;
  }

  return xrpcCall({
    nsid: "app.blebbit.authr.page.getPage",
    method: "GET",
    params,
  });
}
