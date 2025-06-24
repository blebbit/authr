import { xrpcCall } from "./call";

import {
  type APP_BLEBBIT_AUTHR_FOLDER_DELETE_FOLDER_RELATIONSHIP_INPUT,
  APP_BLEBBIT_AUTHR_FOLDER_DELETE_FOLDER_RELATIONSHIP_INPUT_SCHEMA,
} from "../../common-ts";

export async function appBlebbitAuthrFolderDeleteFolderRelationship(
  payload: APP_BLEBBIT_AUTHR_FOLDER_DELETE_FOLDER_RELATIONSHIP_INPUT,
): Promise<any> {
  // check payload
  const payloadCheck =
    APP_BLEBBIT_AUTHR_FOLDER_DELETE_FOLDER_RELATIONSHIP_INPUT_SCHEMA.safeParse(
      payload,
    );
  if (!payloadCheck.success) {
    return payloadCheck.error.issues;
  }

  return xrpcCall({
    nsid: "app.blebbit.authr.folder.deleteFolderRelationship",
    method: "POST",
    payload,
  });
}
