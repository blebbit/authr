import { z } from "zod/v4";

export const APP_BLEBBIT_AUTHR_GROUP_UPDATE_GROUP_DOC = {
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
        action: "update",
      },
      input: {
        encoding: "application/json",
        schema: {
          properties: {
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
          required: ["name"],
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
  description: "update a group",
  id: "app.blebbit.authr.group.updateGroup",
  lexicon: 1,
  revision: 1,
};

export type APP_BLEBBIT_AUTHR_GROUP_UPDATE_GROUP_PARAMETERS = {
  id: string;
  replace?: boolean;
};
export const APP_BLEBBIT_AUTHR_GROUP_UPDATE_GROUP_PARAMETERS_SCHEMA = z.object({
  id: z.string(),
  replace: z.boolean().optional(),
});

export type APP_BLEBBIT_AUTHR_GROUP_UPDATE_GROUP_INPUT = {
  description?: string;
  display?: string;
  name: string;
  public?: boolean;
};
export const APP_BLEBBIT_AUTHR_GROUP_UPDATE_GROUP_INPUT_SCHEMA = z.object({
  description: z.string().optional(),
  display: z.string().optional(),
  name: z.string(),
  public: z.boolean().optional(),
});

export type APP_BLEBBIT_AUTHR_GROUP_UPDATE_GROUP_OUTPUT = {
  cuid?: string;
  description?: string;
  display?: string;
  name?: string;
  public?: boolean;
};
export const APP_BLEBBIT_AUTHR_GROUP_UPDATE_GROUP_OUTPUT_SCHEMA = z.object({
  cuid: z.string().optional(),
  description: z.string().optional(),
  display: z.string().optional(),
  name: z.string().optional(),
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
                description:
                    type: string
                display:
                    type: string
                name:
                    type: string
                public:
                    type: boolean
            required:
                - name
            type: object
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
                action: update
            input:
                encoding: application/json
                schema:
                    properties:
                        description:
                            type: string
                        display:
                            type: string
                        name:
                            type: string
                        public:
                            type: boolean
                    required:
                        - name
                    type: object
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
                    id:
                        type: string
                    replace:
                        type: boolean
                required:
                    - id
                type: params
            type: procedure
    description: update a group
    id: app.blebbit.authr.group.updateGroup
    lexicon: 1
    revision: 1

*/
