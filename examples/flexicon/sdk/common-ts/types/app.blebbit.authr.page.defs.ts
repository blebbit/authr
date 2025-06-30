import { z } from "zod/v4";

export const APP_BLEBBIT_AUTHR_PAGE_DEFS_DOC = {
  defs: {
    pageForm: {
      properties: {
        content: {
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
    pageView: {
      properties: {
        content: {
          type: "string",
        },
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
  description: "Common page defs for the Authr Example",
  id: "app.blebbit.authr.page.defs",
  lexicon: 1,
  revision: 1,
};

export type APP_BLEBBIT_AUTHR_PAGE_DEFS_PAGE_FORM = {
  content?: string;
  name?: string;
  public?: boolean;
};

export const APP_BLEBBIT_AUTHR_PAGE_DEFS__PAGE_FORM_SCHEMA = z.object({
  content: z.string().optional(),
  name: z.string().optional(),
  public: z.boolean().optional(),
});

export type APP_BLEBBIT_AUTHR_PAGE_DEFS_PAGE_VIEW = {
  content?: string;
  cuid?: string;
  name?: string;
  public?: boolean;
};

export const APP_BLEBBIT_AUTHR_PAGE_DEFS__PAGE_VIEW_SCHEMA = z.object({
  content: z.string().optional(),
  cuid: z.string().optional(),
  name: z.string().optional(),
  public: z.boolean().optional(),
});
