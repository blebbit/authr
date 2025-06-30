import { z } from "zod/v4";

export const APP_BLEBBIT_AUTHR_PAGE_CREATE_PAGE_RELATIONSHIP_DOC = {
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
        action: "rel-create",
      },
      input: {
        encoding: "application/json",
        schema: {
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
          required: ["subject", "relation", "resource"],
          type: "object",
        },
      },
      type: "procedure",
    },
  },
  description: "create a relationship for page",
  id: "app.blebbit.authr.page.createPageRelationship",
  lexicon: 1,
  revision: 1,
};

export type APP_BLEBBIT_AUTHR_PAGE_CREATE_PAGE_RELATIONSHIP_INPUT = {
  relation: string;
  resource: string;
  subject: string;
};
export const APP_BLEBBIT_AUTHR_PAGE_CREATE_PAGE_RELATIONSHIP_INPUT_SCHEMA =
  z.object({ relation: z.string(), resource: z.string(), subject: z.string() });

/*
D: main
DEF:
    $authzed: admin
    $flexicon:
        action: rel-create
    input:
        encoding: application/json
        schema:
            properties:
                relation:
                    type: string
                resource:
                    type: string
                subject:
                    type: string
            required:
                - subject
                - relation
                - resource
            type: object
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
                action: rel-create
            input:
                encoding: application/json
                schema:
                    properties:
                        relation:
                            type: string
                        resource:
                            type: string
                        subject:
                            type: string
                    required:
                        - subject
                        - relation
                        - resource
                    type: object
            type: procedure
    description: create a relationship for page
    id: app.blebbit.authr.page.createPageRelationship
    lexicon: 1
    revision: 1

*/
