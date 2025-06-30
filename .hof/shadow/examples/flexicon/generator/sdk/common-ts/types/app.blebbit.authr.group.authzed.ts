import { z } from "zod/v4";

export const APP_BLEBBIT_AUTHR_GROUP_AUTHZED_DOC = {
  $authzed: {
    permissions: {
      admin: "owner + parent->admin",
      member: "owner + editor + reader",
      read: "reader + write + parent->read",
      write: "editor + admin + parent->write",
    },
    relations: {
      editor: ["user", "group#member"],
      owner: ["user", "group#member"],
      reader: ["user", "group#member"],
    },
  },
  defs: {},
  description:
    "Relations and permissions available on groups for the Authr Example",
  id: "app.blebbit.authr.group.authzed",
  lexicon: 1,
  revision: 1,
};
