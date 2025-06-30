import { z } from "zod/v4";

export const APP_BLEBBIT_AUTHR_GROUP_DEFS_DOC = {
  defs: {
    groupForm: {
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
    groupView: {
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
  description: "Common defs for the Authr Example",
  id: "app.blebbit.authr.group.defs",
  lexicon: 1,
  revision: 1,
};

export type APP_BLEBBIT_AUTHR_GROUP_DEFS_GROUP_FORM = {
  description?: string;
  display?: string;
  name: string;
  public?: boolean;
};

export const APP_BLEBBIT_AUTHR_GROUP_DEFS__GROUP_FORM_SCHEMA = z.object({
  description: z.string().optional(),
  display: z.string().optional(),
  name: z.string(),
  public: z.boolean().optional(),
});

export type APP_BLEBBIT_AUTHR_GROUP_DEFS_GROUP_VIEW = {
  cuid?: string;
  description?: string;
  display?: string;
  name?: string;
  public?: boolean;
};

export const APP_BLEBBIT_AUTHR_GROUP_DEFS__GROUP_VIEW_SCHEMA = z.object({
  cuid: z.string().optional(),
  description: z.string().optional(),
  display: z.string().optional(),
  name: z.string().optional(),
  public: z.boolean().optional(),
});
