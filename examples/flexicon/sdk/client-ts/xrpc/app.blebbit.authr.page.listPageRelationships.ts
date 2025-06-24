import { xrpcCall } from "./call";

import {
  type APP_BLEBBIT_AUTHR_PAGE_LIST_PAGE_RELATIONSHIPS_PARAMETERS,
  APP_BLEBBIT_AUTHR_PAGE_LIST_PAGE_RELATIONSHIPS_PARAMETERS_SCHEMA,
  type APP_BLEBBIT_AUTHR_PAGE_LIST_PAGE_RELATIONSHIPS_OUTPUT,
  APP_BLEBBIT_AUTHR_PAGE_LIST_PAGE_RELATIONSHIPS_OUTPUT_SCHEMA,
} from "../../common-ts";

export async function appBlebbitAuthrPageListPageRelationships(
  params: APP_BLEBBIT_AUTHR_PAGE_LIST_PAGE_RELATIONSHIPS_PARAMETERS,
): Promise<APP_BLEBBIT_AUTHR_PAGE_LIST_PAGE_RELATIONSHIPS_OUTPUT | any> {
  // check params
  const paramsCheck =
    APP_BLEBBIT_AUTHR_PAGE_LIST_PAGE_RELATIONSHIPS_PARAMETERS_SCHEMA.safeParse(
      params,
    );
  if (!paramsCheck.success) {
    return paramsCheck.error.issues;
  }

  return xrpcCall({
    nsid: "app.blebbit.authr.page.listPageRelationships",
    method: "GET",
    params,
  });
}
