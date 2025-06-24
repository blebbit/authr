package design

import (
  "github.com/blebbit/flexicon/codegen/schema"
)

groupAuthzed: schema.#Lexicon & {
  id: "app.blebbit.authr.group.authzed"
  revision: 1
  description: "Relations and permissions available on groups for the Authr Example"

  $authzed: {
    relations: {
      parent: ["group"]
      owner: ["user", "group#member"]
      editor: ["user", "group#member"]
      reader: ["user", "group#member"]
    }
    permissions: {
      member: "owner + editor + reader"
      // permissions over the group
      admin: "owner + parent->admin"
      write: "editor + admin + parent->write"
      read: "reader + write + parent->read"
    }
  }

  defs: {}
}

groupDefs: schema.#Lexicon & {

  id: "app.blebbit.authr.group.defs"
  revision: 1
  description: "Common defs for the Authr Example"

  defs: {
    groupView: schema.#Object & {
      properties: {
        cuid: schema.#String
        name: schema.#String
        display: schema.#String
        description: schema.#String
        public: schema.#Boolean
      }
    }
    groupForm: schema.#Object & {
      properties: {
        name: schema.#String
        display: schema.#String
        description: schema.#String
        public: schema.#Boolean
      }
      required: ["name"]
    }
  }
}

groupRecord: schema.#Lexicon & {
  id: "app.blebbit.authr.group.record"
  revision: 1
  description: "Lexicon for groups on Authr Example"

  defs: {
    main: schema.#Record & {
      key: "tid"
      record: groupDefs.defs.groupView
    }
  }
}

(#CRUD & {
  #params: {
    name: "group"

    form: groupDefs.defs.groupForm
    view: groupDefs.defs.groupView
  }
}).lexicon