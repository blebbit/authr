import { z } from "zod/v4";

export const APP_BLEBBIT_AUTHR_GROUP_DELETE_GROUP_RELATIONSHIP_DOC = {
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
        action: "rel-delete",
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
          required: ["subject", "resource"],
          type: "object",
        },
      },
      type: "procedure",
    },
  },
  description: "delete a relationship for group",
  id: "app.blebbit.authr.group.deleteGroupRelationship",
  lexicon: 1,
  revision: 1,
};

export type APP_BLEBBIT_AUTHR_GROUP_DELETE_GROUP_RELATIONSHIP_INPUT = {
  relation?: string;
  resource: string;
  subject: string;
};
export const APP_BLEBBIT_AUTHR_GROUP_DELETE_GROUP_RELATIONSHIP_INPUT_SCHEMA =
  z.object({
    relation: z.string().optional(),
    resource: z.string(),
    subject: z.string(),
  });

/*
D: main
DEF:
    $authzed: admin
    $flexicon:
        action: rel-delete
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
                - resource
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
                action: rel-delete
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
                        - resource
                    type: object
            type: procedure
    description: delete a relationship for group
    id: app.blebbit.authr.group.deleteGroupRelationship
    lexicon: 1
    revision: 1

*/
