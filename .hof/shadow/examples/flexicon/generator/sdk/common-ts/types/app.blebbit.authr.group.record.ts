import { z } from "zod/v4";

export const APP_BLEBBIT_AUTHR_GROUP_RECORD_DOC = {
  defs: {
    main: {
      key: "tid",
      record: {
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
      type: "record",
    },
  },
  description: "Lexicon for groups on Authr Example",
  id: "app.blebbit.authr.group.record",
  lexicon: 1,
  revision: 1,
};

export type APP_BLEBBIT_AUTHR_GROUP_RECORD = {
  cuid?: string;
  description?: string;
  display?: string;
  name?: string;
  public?: boolean;
};

export const APP_BLEBBIT_AUTHR_GROUP_RECORD_SCHEMA = z.object({
  cuid: z.string().optional(),
  description: z.string().optional(),
  display: z.string().optional(),
  name: z.string().optional(),
  public: z.boolean().optional(),
});
