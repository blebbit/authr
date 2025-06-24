import { xrpcCall } from "./call";

import {
  type APP_BLEBBIT_AUTHR_FOLDER_DELETE_FOLDER_PARAMETERS,
  APP_BLEBBIT_AUTHR_FOLDER_DELETE_FOLDER_PARAMETERS_SCHEMA,
} from "../../common-ts";

export async function appBlebbitAuthrFolderDeleteFolder(
  params: APP_BLEBBIT_AUTHR_FOLDER_DELETE_FOLDER_PARAMETERS,
): Promise<any> {
  // check params
  const paramsCheck =
    APP_BLEBBIT_AUTHR_FOLDER_DELETE_FOLDER_PARAMETERS_SCHEMA.safeParse(params);
  if (!paramsCheck.success) {
    return paramsCheck.error.issues;
  }

  return xrpcCall({
    nsid: "app.blebbit.authr.folder.deleteFolder",
    method: "POST",
    params,
  });
}
