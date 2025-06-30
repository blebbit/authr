import { z } from "zod/v4";

export const APP_BLEBBIT_AUTHR_FOLDER_CREATE_FOLDER_DOC = {
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
        action: "create",
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
      type: "procedure",
    },
  },
  description: "create a folder",
  id: "app.blebbit.authr.folder.createFolder",
  lexicon: 1,
  revision: 1,
};

export type APP_BLEBBIT_AUTHR_FOLDER_CREATE_FOLDER_INPUT = {
  name?: string;
  parent?: string;
  public?: boolean;
};
export const APP_BLEBBIT_AUTHR_FOLDER_CREATE_FOLDER_INPUT_SCHEMA = z.object({
  name: z.string().optional(),
  parent: z.string().optional(),
  public: z.boolean().optional(),
});

export type APP_BLEBBIT_AUTHR_FOLDER_CREATE_FOLDER_OUTPUT = {
  cuid?: string;
  name?: string;
  parent?: string;
  public?: boolean;
};
export const APP_BLEBBIT_AUTHR_FOLDER_CREATE_FOLDER_OUTPUT_SCHEMA = z.object({
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
        action: create
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
                action: create
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
            type: procedure
    description: create a folder
    id: app.blebbit.authr.folder.createFolder
    lexicon: 1
    revision: 1

*/
