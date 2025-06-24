import { xrpcCall } from "./call";

import {
  type APP_BLEBBIT_AUTHR_PAGE_DELETE_PAGE_PARAMETERS,
  APP_BLEBBIT_AUTHR_PAGE_DELETE_PAGE_PARAMETERS_SCHEMA,
} from "../../common-ts";

export async function appBlebbitAuthrPageDeletePage(
  params: APP_BLEBBIT_AUTHR_PAGE_DELETE_PAGE_PARAMETERS,
): Promise<any> {
  // check params
  const paramsCheck =
    APP_BLEBBIT_AUTHR_PAGE_DELETE_PAGE_PARAMETERS_SCHEMA.safeParse(params);
  if (!paramsCheck.success) {
    return paramsCheck.error.issues;
  }

  return xrpcCall({
    nsid: "app.blebbit.authr.page.deletePage",
    method: "POST",
    params,
  });
}
