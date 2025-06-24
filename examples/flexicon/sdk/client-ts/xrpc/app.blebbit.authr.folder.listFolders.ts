import { xrpcCall } from "./call";

import {
  type APP_BLEBBIT_AUTHR_FOLDER_LIST_FOLDERS_PARAMETERS,
  APP_BLEBBIT_AUTHR_FOLDER_LIST_FOLDERS_PARAMETERS_SCHEMA,
  type APP_BLEBBIT_AUTHR_FOLDER_LIST_FOLDERS_OUTPUT,
  APP_BLEBBIT_AUTHR_FOLDER_LIST_FOLDERS_OUTPUT_SCHEMA,
} from "../../common-ts";

export async function appBlebbitAuthrFolderListFolders(
  params: APP_BLEBBIT_AUTHR_FOLDER_LIST_FOLDERS_PARAMETERS,
): Promise<APP_BLEBBIT_AUTHR_FOLDER_LIST_FOLDERS_OUTPUT | any> {
  // check params
  const paramsCheck =
    APP_BLEBBIT_AUTHR_FOLDER_LIST_FOLDERS_PARAMETERS_SCHEMA.safeParse(params);
  if (!paramsCheck.success) {
    return paramsCheck.error.issues;
  }

  return xrpcCall({
    nsid: "app.blebbit.authr.folder.listFolders",
    method: "GET",
    params,
  });
}
