import { xrpcCall } from "./call";

import {
  type APP_BLEBBIT_AUTHR_FOLDER_UPDATE_FOLDER_PARAMETERS,
  APP_BLEBBIT_AUTHR_FOLDER_UPDATE_FOLDER_PARAMETERS_SCHEMA,
  type APP_BLEBBIT_AUTHR_FOLDER_UPDATE_FOLDER_INPUT,
  APP_BLEBBIT_AUTHR_FOLDER_UPDATE_FOLDER_INPUT_SCHEMA,
  type APP_BLEBBIT_AUTHR_FOLDER_UPDATE_FOLDER_OUTPUT,
  APP_BLEBBIT_AUTHR_FOLDER_UPDATE_FOLDER_OUTPUT_SCHEMA,
} from "../../common-ts";

export async function appBlebbitAuthrFolderUpdateFolder(
  params: APP_BLEBBIT_AUTHR_FOLDER_UPDATE_FOLDER_PARAMETERS,
  payload: APP_BLEBBIT_AUTHR_FOLDER_UPDATE_FOLDER_INPUT,
): Promise<APP_BLEBBIT_AUTHR_FOLDER_UPDATE_FOLDER_OUTPUT | any> {
  // check params
  const paramsCheck =
    APP_BLEBBIT_AUTHR_FOLDER_UPDATE_FOLDER_PARAMETERS_SCHEMA.safeParse(params);
  if (!paramsCheck.success) {
    return paramsCheck.error.issues;
  }

  // check payload
  const payloadCheck =
    APP_BLEBBIT_AUTHR_FOLDER_UPDATE_FOLDER_INPUT_SCHEMA.safeParse(payload);
  if (!payloadCheck.success) {
    return payloadCheck.error.issues;
  }

  return xrpcCall({
    nsid: "app.blebbit.authr.folder.updateFolder",
    method: "POST",
    params,
    payload,
  });
}
