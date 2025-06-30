package design

import (
  "github.com/blebbit/flexicon/codegen/schema"
)

lexicon: {

  folderAuthzed: schema.#Lexicon & {
    id: "app.blebbit.authr.folder.authzed"
    revision: 1
    description: "Relations and permissions available on folders for the Authr Example"

    $authzed: {
      relations: {
        parent: ["folder"]
        owner: ["user", "group#member"]
        editor: ["user", "group#member"]
        reviewer: ["user", "group#member"]
        commenter: ["user", "group#member"]
        reader: ["user", "group#member"]
      }
      permissions: {
        admin: "owner + parent->admin"
        write: "editor + admin + parent->write"
        feedback: "reviewer + write + parent->feedback"
        comment: "commenter + feedback + parent->comment"
        read: "reader + comment + parent->read"
      }
    }

    defs: {}
  }

  folderDefs: schema.#Lexicon & {

    id: "app.blebbit.authr.folder.defs"
    revision: 1
    description: "Common folder defs for the Authr Example"

    defs: {
      folderView: schema.#Object & {
        properties: {
          cuid: schema.#String
          name: schema.#String
          public: schema.#Boolean
        }
      }
      folderForm: schema.#Object & {
        properties: {
          name: schema.#String
          public: schema.#Boolean
        }
      }
    }
  }

  folderRecord: schema.#Lexicon & {
    id: "app.blebbit.authr.folder.record"
    revision: 1
    description: "Lexicon for folders on Authr Example"

    defs: {
      main: schema.#Record & {
        key: "tid"
        record: folderDefs.defs.folderView
      }
    }
  }

  (#CRUD & {
    #params: {
      name: "folder"

      parented: true
      parent: "folder"

      form: folderDefs.defs.folderForm
      view: folderDefs.defs.folderView
    }
  }).lexicon

  // createFolder: defs: main: $flexicon: selfProxy: true

}
