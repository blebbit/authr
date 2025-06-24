import { xrpcCall } from "./call";

import {
  type APP_BLEBBIT_AUTHR_FOLDER_CREATE_FOLDER_INPUT,
  APP_BLEBBIT_AUTHR_FOLDER_CREATE_FOLDER_INPUT_SCHEMA,
  type APP_BLEBBIT_AUTHR_FOLDER_CREATE_FOLDER_OUTPUT,
  APP_BLEBBIT_AUTHR_FOLDER_CREATE_FOLDER_OUTPUT_SCHEMA,
} from "../../common-ts";

export async function appBlebbitAuthrFolderCreateFolder(
  payload: APP_BLEBBIT_AUTHR_FOLDER_CREATE_FOLDER_INPUT,
): Promise<APP_BLEBBIT_AUTHR_FOLDER_CREATE_FOLDER_OUTPUT | any> {
  // check payload
  const payloadCheck =
    APP_BLEBBIT_AUTHR_FOLDER_CREATE_FOLDER_INPUT_SCHEMA.safeParse(payload);
  if (!payloadCheck.success) {
    return payloadCheck.error.issues;
  }

  return xrpcCall({
    nsid: "app.blebbit.authr.folder.createFolder",
    method: "POST",
    payload,
  });
}
