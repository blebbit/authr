import { z } from "zod/v4";

export const APP_BLEBBIT_AUTHR_FOLDER_DEFS_DOC = {
  defs: {
    folderForm: {
      properties: {
        name: {
          type: "string",
        },
        public: {
          type: "boolean",
        },
      },
      type: "object",
    },
    folderView: {
      properties: {
        cuid: {
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
  description: "Common folder defs for the Authr Example",
  id: "app.blebbit.authr.folder.defs",
  lexicon: 1,
  revision: 1,
};

export type APP_BLEBBIT_AUTHR_FOLDER_DEFS_FOLDER_FORM = {
  name?: string;
  public?: boolean;
};

export const APP_BLEBBIT_AUTHR_FOLDER_DEFS__FOLDER_FORM_SCHEMA = z.object({
  name: z.string().optional(),
  public: z.boolean().optional(),
});

export type APP_BLEBBIT_AUTHR_FOLDER_DEFS_FOLDER_VIEW = {
  cuid?: string;
  name?: string;
  public?: boolean;
};

export const APP_BLEBBIT_AUTHR_FOLDER_DEFS__FOLDER_VIEW_SCHEMA = z.object({
  cuid: z.string().optional(),
  name: z.string().optional(),
  public: z.boolean().optional(),
});
