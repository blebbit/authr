import { z } from "zod/v4";

export const APP_BLEBBIT_AUTHR_GROUP_LIST_GROUPS_DOC = {
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
      $authzed: "read",
      $flexicon: {
        action: "list",
      },
      output: {
        encoding: "application/json",
        schema: {
          properties: {
            groups: {
              items: {
                properties: {
                  cuid: {
                    type: "string",
                  },
                  description: {
                    type: "string",
                  },
                  display: {
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
        },
        type: "params",
      },
      type: "query",
    },
  },
  description: "get a group list",
  id: "app.blebbit.authr.group.listGroups",
  lexicon: 1,
  revision: 1,
};

export type APP_BLEBBIT_AUTHR_GROUP_LIST_GROUPS_PARAMETERS = {
  account?: string;
  cursor?: string;
  limit?: string;
};
export const APP_BLEBBIT_AUTHR_GROUP_LIST_GROUPS_PARAMETERS_SCHEMA = z.object({
  account: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.string().optional(),
});

export type APP_BLEBBIT_AUTHR_GROUP_LIST_GROUPS_OUTPUT = {
  groups?: Array<{
    cuid?: string;
    description?: string;
    display?: string;
    name?: string;
    public?: boolean;
  }>;
};
export const APP_BLEBBIT_AUTHR_GROUP_LIST_GROUPS_OUTPUT_SCHEMA = z.object({
  groups: z
    .array(
      z.object({
        cuid: z.string().optional(),
        description: z.string().optional(),
        display: z.string().optional(),
        name: z.string().optional(),
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
                groups:
                    items:
                        properties:
                            cuid:
                                type: string
                            description:
                                type: string
                            display:
                                type: string
                            name:
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
            $authzed: read
            $flexicon:
                action: list
            output:
                encoding: application/json
                schema:
                    properties:
                        groups:
                            items:
                                properties:
                                    cuid:
                                        type: string
                                    description:
                                        type: string
                                    display:
                                        type: string
                                    name:
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
                type: params
            type: query
    description: get a group list
    id: app.blebbit.authr.group.listGroups
    lexicon: 1
    revision: 1

*/
