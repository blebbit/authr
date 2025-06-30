import { z } from "zod/v4";

export const APP_BLEBBIT_AUTHR_PAGE_DELETE_PAGE_DOC = {
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
  description: "delete a page",
  id: "app.blebbit.authr.page.deletePage",
  lexicon: 1,
  revision: 1,
};

export type APP_BLEBBIT_AUTHR_PAGE_DELETE_PAGE_PARAMETERS = {
  id?: string;
};
export const APP_BLEBBIT_AUTHR_PAGE_DELETE_PAGE_PARAMETERS_SCHEMA = z.object({
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
                action: delete
            parameters:
                properties:
                    id:
                        type: string
                type: params
            type: procedure
    description: delete a page
    id: app.blebbit.authr.page.deletePage
    lexicon: 1
    revision: 1

*/
