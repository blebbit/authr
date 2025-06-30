import { z } from "zod/v4";

export const APP_BLEBBIT_AUTHR_PAGE_UPDATE_PAGE_DOC = {
  $flexicon: {
    lname: "page",
    lplural: "pages",
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
            content: {
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
      output: {
        encoding: "application/json",
        schema: {
          properties: {
            content: {
              type: "string",
            },
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
  description: "update a page",
  id: "app.blebbit.authr.page.updatePage",
  lexicon: 1,
  revision: 1,
};

export type APP_BLEBBIT_AUTHR_PAGE_UPDATE_PAGE_PARAMETERS = {
  id: string;
  replace?: boolean;
};
export const APP_BLEBBIT_AUTHR_PAGE_UPDATE_PAGE_PARAMETERS_SCHEMA = z.object({
  id: z.string(),
  replace: z.boolean().optional(),
});

export type APP_BLEBBIT_AUTHR_PAGE_UPDATE_PAGE_INPUT = {
  content?: string;
  name?: string;
  parent?: string;
  public?: boolean;
};
export const APP_BLEBBIT_AUTHR_PAGE_UPDATE_PAGE_INPUT_SCHEMA = z.object({
  content: z.string().optional(),
  name: z.string().optional(),
  parent: z.string().optional(),
  public: z.boolean().optional(),
});

export type APP_BLEBBIT_AUTHR_PAGE_UPDATE_PAGE_OUTPUT = {
  content?: string;
  cuid?: string;
  name?: string;
  parent?: string;
  public?: boolean;
};
export const APP_BLEBBIT_AUTHR_PAGE_UPDATE_PAGE_OUTPUT_SCHEMA = z.object({
  content: z.string().optional(),
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
                content:
                    type: string
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
                content:
                    type: string
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
        lname: page
        lplural: pages
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
                        content:
                            type: string
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
                        content:
                            type: string
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
    description: update a page
    id: app.blebbit.authr.page.updatePage
    lexicon: 1
    revision: 1

*/
