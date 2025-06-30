import { z } from "zod/v4";

export const APP_BLEBBIT_AUTHR_FOLDER_UPDATE_FOLDER_DOC = {
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
        action: "update",
      },
      input: {
        encoding: "application/json",
        schema: {
          properties: {
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
            parent: {
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
          id: {
            type: "string",
          },
          replace: {
            type: "boolean",
          },
        },
        required: ["id"],
        type: "params",
      },
      type: "procedure",
    },
  },
  description: "update a folder",
  id: "app.blebbit.authr.folder.updateFolder",
  lexicon: 1,
  revision: 1,
};

export type APP_BLEBBIT_AUTHR_FOLDER_UPDATE_FOLDER_PARAMETERS = {
  id: string;
  replace?: boolean;
};
export const APP_BLEBBIT_AUTHR_FOLDER_UPDATE_FOLDER_PARAMETERS_SCHEMA =
  z.object({ id: z.string(), replace: z.boolean().optional() });

export type APP_BLEBBIT_AUTHR_FOLDER_UPDATE_FOLDER_INPUT = {
  name?: string;
  parent?: string;
  public?: boolean;
};
export const APP_BLEBBIT_AUTHR_FOLDER_UPDATE_FOLDER_INPUT_SCHEMA = z.object({
  name: z.string().optional(),
  parent: z.string().optional(),
  public: z.boolean().optional(),
});

export type APP_BLEBBIT_AUTHR_FOLDER_UPDATE_FOLDER_OUTPUT = {
  cuid?: string;
  name?: string;
  parent?: string;
  public?: boolean;
};
export const APP_BLEBBIT_AUTHR_FOLDER_UPDATE_FOLDER_OUTPUT_SCHEMA = z.object({
  cuid: z.string().optional(),
  name: z.string().optional(),
  parent: z.string().optional(),
  public: z.boolean().optional(),
});

/*
D: main
DEF:
    $authzed: admin
    $flexicon:
        action: update
    input:
        encoding: application/json
        schema:
            properties:
                name:
                    type: string
                parent:
                    type: string
                public:
                    type: boolean
            type: object
    output:
        encoding: application/json
        schema:
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
    parameters:
        properties:
            id:
                type: string
            replace:
                type: boolean
        required:
            - id
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
                action: update
            input:
                encoding: application/json
                schema:
                    properties:
                        name:
                            type: string
                        parent:
                            type: string
                        public:
                            type: boolean
                    type: object
            output:
                encoding: application/json
                schema:
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
            parameters:
                properties:
                    id:
                        type: string
                    replace:
                        type: boolean
                required:
                    - id
                type: params
            type: procedure
    description: update a folder
    id: app.blebbit.authr.folder.updateFolder
    lexicon: 1
    revision: 1

*/
