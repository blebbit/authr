import { xrpcCall } from "./call";

import {
  type APP_BLEBBIT_AUTHR_FOLDER_GET_FOLDER_PARAMETERS,
  APP_BLEBBIT_AUTHR_FOLDER_GET_FOLDER_PARAMETERS_SCHEMA,
  type APP_BLEBBIT_AUTHR_FOLDER_GET_FOLDER_OUTPUT,
  APP_BLEBBIT_AUTHR_FOLDER_GET_FOLDER_OUTPUT_SCHEMA,
} from "../../common-ts";

export async function appBlebbitAuthrFolderGetFolder(
  params: APP_BLEBBIT_AUTHR_FOLDER_GET_FOLDER_PARAMETERS,
): Promise<APP_BLEBBIT_AUTHR_FOLDER_GET_FOLDER_OUTPUT | any> {
  // check params
  const paramsCheck =
    APP_BLEBBIT_AUTHR_FOLDER_GET_FOLDER_PARAMETERS_SCHEMA.safeParse(params);
  if (!paramsCheck.success) {
    return paramsCheck.error.issues;
  }

  return xrpcCall({
    nsid: "app.blebbit.authr.folder.getFolder",
    method: "GET",
    params,
  });
}
