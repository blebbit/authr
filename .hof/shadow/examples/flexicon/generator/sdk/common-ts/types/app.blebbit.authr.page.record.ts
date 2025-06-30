import { z } from "zod/v4";

export const APP_BLEBBIT_AUTHR_PAGE_RECORD_DOC = {
  defs: {
    main: {
      key: "tid",
      record: {
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
      type: "record",
    },
  },
  description: "Lexicon for pages on Authr Example",
  id: "app.blebbit.authr.page.record",
  lexicon: 1,
  revision: 1,
};

export type APP_BLEBBIT_AUTHR_PAGE_RECORD = {
  content?: string;
  cuid?: string;
  name?: string;
  public?: boolean;
};

export const APP_BLEBBIT_AUTHR_PAGE_RECORD_SCHEMA = z.object({
  content: z.string().optional(),
  cuid: z.string().optional(),
  name: z.string().optional(),
  public: z.boolean().optional(),
});
