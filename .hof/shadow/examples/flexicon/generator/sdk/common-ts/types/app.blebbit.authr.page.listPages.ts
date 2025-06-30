import { z } from "zod/v4";

export const APP_BLEBBIT_AUTHR_PAGE_LIST_PAGES_DOC = {
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
      $authzed: "read",
      $flexicon: {
        action: "list",
      },
      output: {
        encoding: "application/json",
        schema: {
          properties: {
            pages: {
              items: {
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
  description: "get a page list",
  id: "app.blebbit.authr.page.listPages",
  lexicon: 1,
  revision: 1,
};

export type APP_BLEBBIT_AUTHR_PAGE_LIST_PAGES_PARAMETERS = {
  account?: string;
  cursor?: string;
  limit?: string;
  parent?: string;
};
export const APP_BLEBBIT_AUTHR_PAGE_LIST_PAGES_PARAMETERS_SCHEMA = z.object({
  account: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.string().optional(),
  parent: z.string().optional(),
});

export type APP_BLEBBIT_AUTHR_PAGE_LIST_PAGES_OUTPUT = {
  pages?: Array<{
    content?: string;
    cuid?: string;
    name?: string;
    parent?: string;
    public?: boolean;
  }>;
};
export const APP_BLEBBIT_AUTHR_PAGE_LIST_PAGES_OUTPUT_SCHEMA = z.object({
  pages: z
    .array(
      z.object({
        content: z.string().optional(),
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
                pages:
                    items:
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
        lname: page
        lplural: pages
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
                        pages:
                            items:
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
    description: get a page list
    id: app.blebbit.authr.page.listPages
    lexicon: 1
    revision: 1

*/
