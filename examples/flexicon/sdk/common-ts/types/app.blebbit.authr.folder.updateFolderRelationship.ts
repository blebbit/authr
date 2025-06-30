import { z } from "zod/v4";

export const APP_BLEBBIT_AUTHR_FOLDER_UPDATE_FOLDER_RELATIONSHIP_DOC = {
  $flexicon: {
    lname: "folder",
    lplural: "folders",
    parent: "folder",
    parented: true,
    permissioned: true,
    typeAhead: "",
  },
  defs: {
    main: {
      $authzed: "admin",
      $flexicon: {
        action: "rel-update",
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
  description: "update a relationship for folder",
  id: "app.blebbit.authr.folder.updateFolderRelationship",
  lexicon: 1,
  revision: 1,
};

export type APP_BLEBBIT_AUTHR_FOLDER_UPDATE_FOLDER_RELATIONSHIP_INPUT = {
  relation: string;
  resource: string;
  subject: string;
};
export const APP_BLEBBIT_AUTHR_FOLDER_UPDATE_FOLDER_RELATIONSHIP_INPUT_SCHEMA =
  z.object({ relation: z.string(), resource: z.string(), subject: z.string() });

/*
D: main
DEF:
    $authzed: admin
    $flexicon:
        action: rel-update
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
        lname: folder
        lplural: folders
        parent: folder
        parented: true
        permissioned: true
        typeAhead: ""
    defs:
        main:
            $authzed: admin
            $flexicon:
                action: rel-update
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
    description: update a relationship for folder
    id: app.blebbit.authr.folder.updateFolderRelationship
    lexicon: 1
    revision: 1

*/
