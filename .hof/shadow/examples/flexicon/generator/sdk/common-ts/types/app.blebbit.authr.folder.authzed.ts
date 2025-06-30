import { z } from "zod/v4";

export const APP_BLEBBIT_AUTHR_FOLDER_AUTHZED_DOC = {
  $authzed: {
    permissions: {
      admin: "owner + parent->admin",
      comment: "commenter + feedback + parent->comment",
      feedback: "reviewer + write + parent->feedback",
      read: "reader + comment + parent->read",
      write: "editor + admin + parent->write",
    },
    relations: {
      commenter: ["user", "group#member"],
      editor: ["user", "group#member"],
      owner: ["user", "group#member"],
      parent: ["folder"],
      reader: ["user", "group#member"],
      reviewer: ["user", "group#member"],
    },
  },
  defs: {},
  description:
    "Relations and permissions available on folders for the Authr Example",
  id: "app.blebbit.authr.folder.authzed",
  lexicon: 1,
  revision: 1,
};
