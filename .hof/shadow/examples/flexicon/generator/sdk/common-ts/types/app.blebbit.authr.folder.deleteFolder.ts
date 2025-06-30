import { z } from "zod/v4";

export const APP_BLEBBIT_AUTHR_FOLDER_DELETE_FOLDER_DOC = {
  $flexicon: {
    lname: "folder",
    lplural: "folders",
    parent: "folder",
    parented: true,
    permissioned: true,
    typeAhead: "",
  },
  defs: {
    main: {
      $authzed: "admin",
      $flexicon: {
        action: "delete",
      },
      parameters: {
        properties: {
          id: {
            type: "string",
          },
        },
        type: "params",
      },
      type: "procedure",
    },
  },
  description: "delete a folder",
  id: "app.blebbit.authr.folder.deleteFolder",
  lexicon: 1,
  revision: 1,
};

export type APP_BLEBBIT_AUTHR_FOLDER_DELETE_FOLDER_PARAMETERS = {
  id?: string;
};
export const APP_BLEBBIT_AUTHR_FOLDER_DELETE_FOLDER_PARAMETERS_SCHEMA =
  z.object({ id: z.string().optional() });

/*
D: main
DEF:
    $authzed: admin
    $flexicon:
        action: delete
    parameters:
        properties:
            id:
                type: string
        type: params
    type: procedure
LEX:
    $flexicon:
        lname: folder
        lplural: folders
        parent: folder
        parented: true
        permissioned: true
        typeAhead: ""
    defs:
        main:
            $authzed: admin
            $flexicon:
                action: delete
            parameters:
                properties:
                    id:
                        type: string
                type: params
            type: procedure
    description: delete a folder
    id: app.blebbit.authr.folder.deleteFolder
    lexicon: 1
    revision: 1

*/
