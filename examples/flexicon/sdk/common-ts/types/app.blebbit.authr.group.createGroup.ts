import { z } from "zod/v4";

export const APP_BLEBBIT_AUTHR_GROUP_CREATE_GROUP_DOC = {
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
        action: "create",
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
      type: "procedure",
    },
  },
  description: "create a group",
  id: "app.blebbit.authr.group.createGroup",
  lexicon: 1,
  revision: 1,
};

export type APP_BLEBBIT_AUTHR_GROUP_CREATE_GROUP_INPUT = {
  description?: string;
  display?: string;
  name: string;
  public?: boolean;
};
export const APP_BLEBBIT_AUTHR_GROUP_CREATE_GROUP_INPUT_SCHEMA = z.object({
  description: z.string().optional(),
  display: z.string().optional(),
  name: z.string(),
  public: z.boolean().optional(),
});

export type APP_BLEBBIT_AUTHR_GROUP_CREATE_GROUP_OUTPUT = {
  cuid?: string;
  description?: string;
  display?: string;
  name?: string;
  public?: boolean;
};
export const APP_BLEBBIT_AUTHR_GROUP_CREATE_GROUP_OUTPUT_SCHEMA = z.object({
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
        action: create
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
                action: create
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
            type: procedure
    description: create a group
    id: app.blebbit.authr.group.createGroup
    lexicon: 1
    revision: 1

*/
