import { z } from "zod/v4";

export const APP_BLEBBIT_AUTHR_GROUP_LIST_GROUP_RELATIONSHIPS_DOC = {
  $flexicon: {
    lname: "group",
    lplural: "groups",
    parent: "",
    parented: false,
    permissioned: true,
    typeAhead: "name",
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
            groups: {
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
  description: "get a list of relationships for a group",
  id: "app.blebbit.authr.group.listGroupRelationships",
  lexicon: 1,
  revision: 1,
};

export type APP_BLEBBIT_AUTHR_GROUP_LIST_GROUP_RELATIONSHIPS_PARAMETERS = {
  cursor?: string;
  id?: string;
  limit?: number;
};
export const APP_BLEBBIT_AUTHR_GROUP_LIST_GROUP_RELATIONSHIPS_PARAMETERS_SCHEMA =
  z.object({
    cursor: z.string().optional(),
    id: z.string().optional(),
    limit: z.number().optional(),
  });

export type APP_BLEBBIT_AUTHR_GROUP_LIST_GROUP_RELATIONSHIPS_OUTPUT = {
  groups?: Array<{
    relation?: string;
    resource?: string;
    subject?: string;
  }>;
};
export const APP_BLEBBIT_AUTHR_GROUP_LIST_GROUP_RELATIONSHIPS_OUTPUT_SCHEMA =
  z.object({
    groups: z
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
                groups:
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
        lname: group
        lplural: groups
        parent: ""
        parented: false
        permissioned: true
        typeAhead: name
    defs:
        main:
            $authzed: admin
            $flexicon:
                action: rel-list
            output:
                encoding: application/json
                schema:
                    properties:
                        groups:
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
    description: get a list of relationships for a group
    id: app.blebbit.authr.group.listGroupRelationships
    lexicon: 1
    revision: 1

*/
