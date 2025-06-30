import { z } from "zod/v4";

export const APP_BLEBBIT_AUTHR_GROUP_DELETE_GROUP_DOC = {
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
        action: "delete",
      },
      parameters: {
        properties: {
          id: {
            type: "string",
          },
        },
        type: "params",
      },
      type: "procedure",
    },
  },
  description: "delete a group",
  id: "app.blebbit.authr.group.deleteGroup",
  lexicon: 1,
  revision: 1,
};

export type APP_BLEBBIT_AUTHR_GROUP_DELETE_GROUP_PARAMETERS = {
  id?: string;
};
export const APP_BLEBBIT_AUTHR_GROUP_DELETE_GROUP_PARAMETERS_SCHEMA = z.object({
  id: z.string().optional(),
});

/*
D: main
DEF:
    $authzed: admin
    $flexicon:
        action: delete
    parameters:
        properties:
            id:
                type: string
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
                action: delete
            parameters:
                properties:
                    id:
                        type: string
                type: params
            type: procedure
    description: delete a group
    id: app.blebbit.authr.group.deleteGroup
    lexicon: 1
    revision: 1

*/
