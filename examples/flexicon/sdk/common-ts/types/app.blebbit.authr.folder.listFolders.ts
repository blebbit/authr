import { z } from "zod/v4";

export const APP_BLEBBIT_AUTHR_FOLDER_LIST_FOLDERS_DOC = {
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
        action: "list",
      },
      output: {
        encoding: "application/json",
        schema: {
          properties: {
            folders: {
              items: {
                properties: {
                  cuid: {
                    type: "string",
                  },
                  name: {
                    type: "string",
                  },
                  parent: {
                    type: "string",
                  },
                  public: {
                    type: "boolean",
                  },
                },
                type: "object",
              },
              type: "array",
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
          cursor: {
            type: "string",
          },
          limit: {
            type: "string",
          },
          parent: {
            type: "string",
          },
        },
        type: "params",
      },
      type: "query",
    },
  },
  description: "get a folder list",
  id: "app.blebbit.authr.folder.listFolders",
  lexicon: 1,
  revision: 1,
};

export type APP_BLEBBIT_AUTHR_FOLDER_LIST_FOLDERS_PARAMETERS = {
  account?: string;
  cursor?: string;
  limit?: string;
  parent?: string;
};
export const APP_BLEBBIT_AUTHR_FOLDER_LIST_FOLDERS_PARAMETERS_SCHEMA = z.object(
  {
    account: z.string().optional(),
    cursor: z.string().optional(),
    limit: z.string().optional(),
    parent: z.string().optional(),
  },
);

export type APP_BLEBBIT_AUTHR_FOLDER_LIST_FOLDERS_OUTPUT = {
  folders?: Array<{
    cuid?: string;
    name?: string;
    parent?: string;
    public?: boolean;
  }>;
};
export const APP_BLEBBIT_AUTHR_FOLDER_LIST_FOLDERS_OUTPUT_SCHEMA = z.object({
  folders: z
    .array(
      z.object({
        cuid: z.string().optional(),
        name: z.string().optional(),
        parent: z.string().optional(),
        public: z.boolean().optional(),
      }),
    )
    .optional(),
});

/*
D: main
DEF:
    $authzed: read
    $flexicon:
        action: list
    output:
        encoding: application/json
        schema:
            properties:
                folders:
                    items:
                        properties:
                            cuid:
                                type: string
                            name:
                                type: string
                            parent:
                                type: string
                            public:
                                type: boolean
                        type: object
                    type: array
            type: object
    parameters:
        properties:
            account:
                type: string
            cursor:
                type: string
            limit:
                type: string
            parent:
                type: string
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
                action: list
            output:
                encoding: application/json
                schema:
                    properties:
                        folders:
                            items:
                                properties:
                                    cuid:
                                        type: string
                                    name:
                                        type: string
                                    parent:
                                        type: string
                                    public:
                                        type: boolean
                                type: object
                            type: array
                    type: object
            parameters:
                properties:
                    account:
                        type: string
                    cursor:
                        type: string
                    limit:
                        type: string
                    parent:
                        type: string
                type: params
            type: query
    description: get a folder list
    id: app.blebbit.authr.folder.listFolders
    lexicon: 1
    revision: 1

*/
