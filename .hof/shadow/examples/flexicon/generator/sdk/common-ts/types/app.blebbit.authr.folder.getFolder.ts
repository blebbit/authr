import { z } from "zod/v4";

export const APP_BLEBBIT_AUTHR_FOLDER_GET_FOLDER_DOC = {
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
      $authzed: "read",
      $flexicon: {
        action: "get",
      },
      output: {
        encoding: "application/json",
        schema: {
          properties: {
            cuid: {
              type: "string",
            },
            name: {
              type: "string",
            },
            public: {
              type: "boolean",
            },
          },
          type: "object",
        },
      },
      parameters: {
        properties: {
          account: {
            type: "string",
          },
          id: {
            type: "string",
          },
        },
        required: ["id"],
        type: "params",
      },
      type: "query",
    },
  },
  description: "get a folder by id",
  id: "app.blebbit.authr.folder.getFolder",
  lexicon: 1,
  revision: 1,
};

export type APP_BLEBBIT_AUTHR_FOLDER_GET_FOLDER_PARAMETERS = {
  account?: string;
  id: string;
};
export const APP_BLEBBIT_AUTHR_FOLDER_GET_FOLDER_PARAMETERS_SCHEMA = z.object({
  account: z.string().optional(),
  id: z.string(),
});

export type APP_BLEBBIT_AUTHR_FOLDER_GET_FOLDER_OUTPUT = {
  cuid?: string;
  name?: string;
  public?: boolean;
};
export const APP_BLEBBIT_AUTHR_FOLDER_GET_FOLDER_OUTPUT_SCHEMA = z.object({
  cuid: z.string().optional(),
  name: z.string().optional(),
  public: z.boolean().optional(),
});

/*
D: main
DEF:
    $authzed: read
    $flexicon:
        action: get
    output:
        encoding: application/json
        schema:
            properties:
                cuid:
                    type: string
                name:
                    type: string
                public:
                    type: boolean
            type: object
    parameters:
        properties:
            account:
                type: string
            id:
                type: string
        required:
            - id
        type: params
    type: query
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
            $authzed: read
            $flexicon:
                action: get
            output:
                encoding: application/json
                schema:
                    properties:
                        cuid:
                            type: string
                        name:
                            type: string
                        public:
                            type: boolean
                    type: object
            parameters:
                properties:
                    account:
                        type: string
                    id:
                        type: string
                required:
                    - id
                type: params
            type: query
    description: get a folder by id
    id: app.blebbit.authr.folder.getFolder
    lexicon: 1
    revision: 1

*/
