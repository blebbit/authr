import { z } from "zod/v4";

export const APP_BLEBBIT_AUTHR_PAGE_LIST_PAGE_RELATIONSHIPS_DOC = {
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
        action: "rel-list",
      },
      output: {
        encoding: "application/json",
        schema: {
          properties: {
            pages: {
              items: {
                properties: {
                  relation: {
                    type: "string",
                  },
                  resource: {
                    type: "string",
                  },
                  subject: {
                    type: "string",
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
          cursor: {
            type: "string",
          },
          id: {
            type: "string",
          },
          limit: {
            type: "integer",
          },
        },
        type: "params",
      },
      type: "query",
    },
  },
  description: "get a list of relationships for a page",
  id: "app.blebbit.authr.page.listPageRelationships",
  lexicon: 1,
  revision: 1,
};

export type APP_BLEBBIT_AUTHR_PAGE_LIST_PAGE_RELATIONSHIPS_PARAMETERS = {
  cursor?: string;
  id?: string;
  limit?: number;
};
export const APP_BLEBBIT_AUTHR_PAGE_LIST_PAGE_RELATIONSHIPS_PARAMETERS_SCHEMA =
  z.object({
    cursor: z.string().optional(),
    id: z.string().optional(),
    limit: z.number().optional(),
  });

export type APP_BLEBBIT_AUTHR_PAGE_LIST_PAGE_RELATIONSHIPS_OUTPUT = {
  pages?: Array<{
    relation?: string;
    resource?: string;
    subject?: string;
  }>;
};
export const APP_BLEBBIT_AUTHR_PAGE_LIST_PAGE_RELATIONSHIPS_OUTPUT_SCHEMA =
  z.object({
    pages: z
      .array(
        z.object({
          relation: z.string().optional(),
          resource: z.string().optional(),
          subject: z.string().optional(),
        }),
      )
      .optional(),
  });

/*
D: main
DEF:
    $authzed: admin
    $flexicon:
        action: rel-list
    output:
        encoding: application/json
        schema:
            properties:
                pages:
                    items:
                        properties:
                            relation:
                                type: string
                            resource:
                                type: string
                            subject:
                                type: string
                        type: object
                    type: array
            type: object
    parameters:
        properties:
            cursor:
                type: string
            id:
                type: string
            limit:
                type: integer
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
            $authzed: admin
            $flexicon:
                action: rel-list
            output:
                encoding: application/json
                schema:
                    properties:
                        pages:
                            items:
                                properties:
                                    relation:
                                        type: string
                                    resource:
                                        type: string
                                    subject:
                                        type: string
                                type: object
                            type: array
                    type: object
            parameters:
                properties:
                    cursor:
                        type: string
                    id:
                        type: string
                    limit:
                        type: integer
                type: params
            type: query
    description: get a list of relationships for a page
    id: app.blebbit.authr.page.listPageRelationships
    lexicon: 1
    revision: 1

*/
