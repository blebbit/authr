package design

import (
  "github.com/blebbit/flexicon/codegen/schema"
)

lexicon: {

  pageAuthzed: schema.#Lexicon & {
    id: "app.blebbit.authr.page.authzed"
    revision: 1
    description: "Relations and permissions available on pages for the Authr Example"

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

  pageDefs: schema.#Lexicon & {

    id: "app.blebbit.authr.page.defs"
    revision: 1
    description: "Common page defs for the Authr Example"

    defs: {
      pageView: schema.#Object & {
        properties: {
          cuid: schema.#String
          name: schema.#String
          public: schema.#Boolean
          content: schema.#String
        }
      }
      pageForm: schema.#Object & {
        properties: {
          name: schema.#String
          public: schema.#Boolean
          content: schema.#String
        }
      }
    }
  }

  pageRecord: schema.#Lexicon & {
    id: "app.blebbit.authr.page.record"
    revision: 1
    description: "Lexicon for pages on Authr Example"

    defs: {
      main: schema.#Record & {
        key: "tid"
        record: pageDefs.defs.pageView
      }
    }
  }

  (#CRUD & {
    #params: {
      name: "page"

      parented: true
      parent: "folder"

      form: pageDefs.defs.pageForm
      view: pageDefs.defs.pageView
    }
  }).lexicon

}