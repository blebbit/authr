import { xrpcCall } from "./call";

import {
  type APP_BLEBBIT_AUTHR_PAGE_CREATE_PAGE_RELATIONSHIP_INPUT,
  APP_BLEBBIT_AUTHR_PAGE_CREATE_PAGE_RELATIONSHIP_INPUT_SCHEMA,
} from "../../common-ts";

export async function appBlebbitAuthrPageCreatePageRelationship(
  payload: APP_BLEBBIT_AUTHR_PAGE_CREATE_PAGE_RELATIONSHIP_INPUT,
): Promise<any> {
  // check payload
  const payloadCheck =
    APP_BLEBBIT_AUTHR_PAGE_CREATE_PAGE_RELATIONSHIP_INPUT_SCHEMA.safeParse(
      payload,
    );
  if (!payloadCheck.success) {
    return payloadCheck.error.issues;
  }

  return xrpcCall({
    nsid: "app.blebbit.authr.page.createPageRelationship",
    method: "POST",
    payload,
  });
}
