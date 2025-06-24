package design

import (
  "strings"

  "github.com/blebbit/flexicon/codegen/schema"
)

#nsidBase: "app.blebbit.authr"

#CRUD: {
  #params: {
    name: string
    Name: strings.ToTitle(name)
    plural: string | *"\(name)s"
    Plural: strings.ToTitle(plural)

    form: _
    view: _

    permissioned: bool | *true
  }

  lexicon: {
    "get\(#params.Name)": schema.#Lexicon & {
      id: "\(#nsidBase).\(#params.name).get\(#params.Name)"
      revision: 1
      description: string | *"get a \(#params.name) by id"

      $flexicon: {
        lname: #params.name
        lplural: #params.plural
      }

      defs: {
        main: schema.#Query & {
          $flexicon: action: "get"
          if #params.permissioned {
            // required permission(s)
            $authzed: string | *"read"
          }

          parameters: {
            properties: {
              id: schema.#String
            }
            required: ["id"]
          }
          output: {
            encoding: "application/json"
            schema: #params.view
          }
        }
      }
    }

    "list\(#params.Plural)": schema.#Lexicon & {
      id: "\(#nsidBase).\(#params.name).list\(#params.Plural)"
      revision: 1
      description: string | *"get a \(#params.name) list"

      $flexicon: {
        lname: #params.name
        lplural: #params.plural
      }

      defs: {
        main: schema.#Query & {
          $flexicon: action: "list"
          if #params.permissioned {
            // required permission(s)
            $authzed: string | *"read"
          }

          parameters: {
            properties: {
              cursor: schema.#String
              limit: schema.#Integer
            }
          }
          output: {
            encoding: "application/json"
            "schema": schema.#Object & {
              properties: {
                (#params.plural): schema.#Array & {
                  items: #params.view
                }
              }
            }
          }
        }
      }
    }

    "create\(#params.Name)": schema.#Lexicon & {
      id: "\(#nsidBase).\(#params.name).create\(#params.Name)"
      revision: 1
      description: string | *"create a \(#params.name)"

      $flexicon: {
        lname: #params.name
        lplural: #params.plural
      }

      defs: {
        main: schema.#Procedure & {
          $flexicon: action: "create"
          if #params.permissioned {
            // required permission(s)
            $authzed: string | *"admin"
          }

          input: {
            encoding: "application/json"
            schema: #params.form
          }
          output: {
            encoding: "application/json"
            schema: #params.view
          }
        }
      }
    }

    "update\(#params.Name)": schema.#Lexicon & {
      id: "\(#nsidBase).\(#params.name).update\(#params.Name)"
      revision: 1
      description: string | *"update a \(#params.name)"

      $flexicon: {
        lname: #params.name
        lplural: #params.plural
      }

      defs: {
        main: schema.#Procedure & {
          $flexicon: action: "update"
          if #params.permissioned {
            // required permission(s)
            $authzed: string | *"admin"
          }

          parameters: {
            properties: {
              id: schema.#String
            }
          }
          input: {
            encoding: "application/json"
            schema: #params.form
          }
          output: {
            encoding: "application/json"
            schema: #params.view
          }
        }
      }
    }

    "delete\(#params.Name)": schema.#Lexicon & {
      id: "\(#nsidBase).\(#params.name).delete\(#params.Name)"
      revision: 1
      description: string | *"delete a \(#params.name)"

      $flexicon: {
        lname: #params.name
        lplural: #params.plural
      }

      defs: {
        main: schema.#Procedure & {
          $flexicon: action: "delete"
          if #params.permissioned {
            // required permission(s)
            $authzed: string | *"admin"
          }

          parameters: {
            properties: {
              id: schema.#String
            }
          }
        }
      }
    }

    if #params.permissioned {

      "list\(#params.Name)Relationships": schema.#Lexicon & {
        id: "\(#nsidBase).\(#params.name).list\(#params.Name)Relationships"
        revision: 1
        description: string | *"get a list of relationships for a \(#params.name)"

        $flexicon: {
          lname: #params.name
        lplural: #params.plural
        }

        defs: {
          main: schema.#Query & {
            $flexicon: action: "rel-list"
            if #params.permissioned {
              // required permission(s)
              $authzed: string | *"admin"
            }

            parameters: {
              properties: {
                id: schema.#String
                cursor: schema.#String
                limit: schema.#Integer
              }
            }
            output: {
              encoding: "application/json"
              "schema": schema.#Object & {
                properties: {
                  (#params.plural): schema.#Array & {
                    items: schema.#Object & {
                      properties: {
                        subject: schema.#String
                        relation: schema.#String
                        resource: schema.#String
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }


      "create\(#params.Name)Relationship": schema.#Lexicon & {
        id: "\(#nsidBase).\(#params.name).create\(#params.Name)Relationship"
        revision: 1
        description: string | *"create a relationship for \(#params.name)"

        $flexicon: {
          lname: #params.name
          lplural: #params.plural
        }

        defs: {
          main: schema.#Procedure & {
            $flexicon: action: "rel-create"
            // required permission(s)
            $authzed: string | *"admin"
            input: { 
              encoding: "application/json"
              "schema": schema.#Object & {
                properties: {
                  subject: schema.#String
                  relation: schema.#String
                  resource: schema.#String
                }
                required: ["subject", "relation", "resource"]
              }
            }
          }
        }
      }

      "update\(#params.Name)Relationship": schema.#Lexicon & {
        id: "\(#nsidBase).\(#params.name).update\(#params.Name)Relationship"
        revision: 1
        description: string | *"update a relationship for \(#params.name)"

        $flexicon: {
          lname: #params.name
          lplural: #params.plural
        }

        defs: {
          main: schema.#Procedure & {
            $flexicon: action: "rel-update"
            // required permission(s)
            $authzed: string | *"admin"

            input: { 
              encoding: "application/json"
              "schema": schema.#Object & {
                properties: {
                  subject: schema.#String
                  relation: schema.#String
                  resource: schema.#String
                }
                required: ["subject", "relation", "resource"]
              }
            }
          }
        }
      }

      "delete\(#params.Name)Relationship": schema.#Lexicon & {
        id: "\(#nsidBase).\(#params.name).delete\(#params.Name)Relationship"
        revision: 1
        description: string | *"delete a relationship for \(#params.name)"

        $flexicon: {
          lname: #params.name
          lplural: #params.plural
        }

        defs: {
          main: schema.#Procedure & {
            $flexicon: action: "rel-delete"
            // required permission(s)
            $authzed: string | *"admin"

            input: { 
              encoding: "application/json"
              "schema": schema.#Object & {
                properties: {
                  subject: schema.#String
                  relation: schema.#String
                  resource: schema.#String
                }
                required: ["subject", "resource"]
              }
            }
          }
        }
      }
      
    }

  }
}