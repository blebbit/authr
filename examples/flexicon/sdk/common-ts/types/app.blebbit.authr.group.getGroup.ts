import { z } from "zod/v4";

export const APP_BLEBBIT_AUTHR_GROUP_GET_GROUP_DOC = {
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
        action: "get",
      },
      output: {
        encoding: "application/json",
        schema: {
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
  description: "get a group by id",
  id: "app.blebbit.authr.group.getGroup",
  lexicon: 1,
  revision: 1,
};

export type APP_BLEBBIT_AUTHR_GROUP_GET_GROUP_PARAMETERS = {
  account?: string;
  id: string;
};
export const APP_BLEBBIT_AUTHR_GROUP_GET_GROUP_PARAMETERS_SCHEMA = z.object({
  account: z.string().optional(),
  id: z.string(),
});

export type APP_BLEBBIT_AUTHR_GROUP_GET_GROUP_OUTPUT = {
  cuid?: string;
  description?: string;
  display?: string;
  name?: string;
  public?: boolean;
};
export const APP_BLEBBIT_AUTHR_GROUP_GET_GROUP_OUTPUT_SCHEMA = z.object({
  cuid: z.string().optional(),
  description: z.string().optional(),
  display: z.string().optional(),
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
                description:
                    type: string
                display:
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
                action: get
            output:
                encoding: application/json
                schema:
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
    description: get a group by id
    id: app.blebbit.authr.group.getGroup
    lexicon: 1
    revision: 1

*/
