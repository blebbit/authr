package design

import (
  "strings"

  flexicon "github.com/blebbit/flexicon/codegen/schema"
)

#nsidBase: "app.blebbit.authr"

#CRUD: {
  #params: {
    name: string
    Name: strings.ToTitle(name)
    plural: string | *"\(name)s"
    Plural: strings.ToTitle(plural)

    parented: bool | *false
    parent: string | *""

    // field to type ahead on
    typeAhead: string | *""

    form: _
    view: _

    permissioned: bool | *true

    $flexicon: {
      lname: #params.name
      lplural: #params.plural
      parented: #params.parented
      parent: #params.parent
      permissioned: #params.permissioned
      typeAhead: #params.typeAhead
    }
  }

  lexicon: {

    "get\(#params.Name)": flexicon.#Lexicon & {
      id: "\(#nsidBase).\(#params.name).get\(#params.Name)"
      revision: 1
      description: string | *"get a \(#params.name) by id"

      $flexicon: #params.$flexicon

      defs: {
        main: flexicon.#Query & {
          $flexicon: action: "get"
          if #params.permissioned {
            // required permission(s)
            $authzed: string | *"read"
          }

          parameters: {
            properties: {
              id: flexicon.#String
              account: flexicon.#String
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

    "list\(#params.Plural)": flexicon.#Lexicon & {
      id: "\(#nsidBase).\(#params.name).list\(#params.Plural)"
      revision: 1
      description: string | *"get a \(#params.name) list"

      $flexicon: #params.$flexicon

      defs: {
        main: flexicon.#Query & {
          $flexicon: action: "list"
          if #params.permissioned {
            // required permission(s)
            $authzed: string | *"read"
          }

          parameters: {
            properties: {
              account: flexicon.#String
              cursor: flexicon.#String
              limit: flexicon.#String
              if #params.parented {
                parent: flexicon.#String
              }
            }
          }
          output: {
            encoding: "application/json"
            schema: flexicon.#Object & {
              properties: {
                (#params.plural): flexicon.#Array & {
                  items: #params.view
                  if #params.parented {
                    items: properties: parent: flexicon.#String
                  }
                }
              }
            }
          }
        }
      }
    }

    if #params.typeAhead != "" {
      "typeAhead\(#params.Plural)": flexicon.#Lexicon & {
        id: "\(#nsidBase).\(#params.name).typeAhead\(#params.Plural)"
        revision: 1
        description: string | *"get matching \(#params.name) by \(#params.typeAhead) prefix"

        $flexicon: #params.$flexicon

        defs: {
          main: flexicon.#Query & {
            $flexicon: action: "type-ahead"
            if #params.permissioned {
              // required permission(s)
              $authzed: string | *"read"
            }

            parameters: {
              properties: {
                prefix: flexicon.#String
                account: flexicon.#String
                cursor: flexicon.#String
                limit: flexicon.#String
                if #params.parented {
                  parent: flexicon.#String
                }
              }
            }
            output: {
              encoding: "application/json"
              schema: flexicon.#Object & {
                properties: {
                  (#params.plural): flexicon.#Array & {
                    items: #params.view
                    if #params.parented {
                      items: properties: parent: flexicon.#String
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    "create\(#params.Name)": flexicon.#Lexicon & {
      id: "\(#nsidBase).\(#params.name).create\(#params.Name)"
      revision: 1
      description: string | *"create a \(#params.name)"

      $flexicon: #params.$flexicon

      defs: {
        main: flexicon.#Procedure & {
          $flexicon: action: "create"
          if #params.permissioned {
            // required permission(s)
            $authzed: string | *"admin"
          }

          input: {
            encoding: "application/json"
            schema: #params.form
            if #params.parented {
              schema: properties: parent: flexicon.#String
            }
          }
          output: {
            encoding: "application/json"
            schema: #params.view
            if #params.parented {
              schema: properties: parent: flexicon.#String
            }
          }
        }
      }
    }

    "update\(#params.Name)": flexicon.#Lexicon & {
      id: "\(#nsidBase).\(#params.name).update\(#params.Name)"
      revision: 1
      description: string | *"update a \(#params.name)"

      $flexicon: #params.$flexicon

      defs: {
        main: flexicon.#Procedure & {
          $flexicon: action: "update"
          if #params.permissioned {
            // required permission(s)
            $authzed: string | *"admin"
          }

          parameters: {
            properties: {
              id: flexicon.#String
              replace: flexicon.#Boolean
            }
            required: ["id"]
          }
          input: {
            encoding: "application/json"
            schema: #params.form
            if #params.parented {
              schema: properties: parent: flexicon.#String
            }
          }
          output: {
            encoding: "application/json"
            schema: #params.view
            if #params.parented {
              schema: properties: parent: flexicon.#String
            }
          }
        }
      }
    }

    "delete\(#params.Name)": flexicon.#Lexicon & {
      id: "\(#nsidBase).\(#params.name).delete\(#params.Name)"
      revision: 1
      description: string | *"delete a \(#params.name)"

      $flexicon: #params.$flexicon

      defs: {
        main: flexicon.#Procedure & {
          $flexicon: action: "delete"
          if #params.permissioned {
            // required permission(s)
            $authzed: string | *"admin"
          }

          parameters: {
            properties: {
              id: flexicon.#String
            }
          }
        }
      }
    }

    if #params.permissioned {

      "list\(#params.Name)Relationships": flexicon.#Lexicon & {
        id: "\(#nsidBase).\(#params.name).list\(#params.Name)Relationships"
        revision: 1
        description: string | *"get a list of relationships for a \(#params.name)"

        $flexicon: #params.$flexicon

        defs: {
          main: flexicon.#Query & {
            $flexicon: action: "rel-list"
            if #params.permissioned {
              // required permission(s)
              $authzed: string | *"admin"
            }

            parameters: {
              properties: {
                id: flexicon.#String
                cursor: flexicon.#String
                limit: flexicon.#Integer
              }
            }
            output: {
              encoding: "application/json"
              schema: flexicon.#Object & {
                properties: {
                  (#params.plural): flexicon.#Array & {
                    items: flexicon.#Object & {
                      properties: {
                        subject: flexicon.#String
                        relation: flexicon.#String
                        resource: flexicon.#String
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }


      "create\(#params.Name)Relationship": flexicon.#Lexicon & {
        id: "\(#nsidBase).\(#params.name).create\(#params.Name)Relationship"
        revision: 1
        description: string | *"create a relationship for \(#params.name)"

        $flexicon: #params.$flexicon

        defs: {
          main: flexicon.#Procedure & {
            $flexicon: action: "rel-create"
            // required permission(s)
            $authzed: string | *"admin"
            input: { 
              encoding: "application/json"
              schema: flexicon.#Object & {
                properties: {
                  subject: flexicon.#String
                  relation: flexicon.#String
                  resource: flexicon.#String
                }
                required: ["subject", "relation", "resource"]
              }
            }
          }
        }
      }

      "update\(#params.Name)Relationship": flexicon.#Lexicon & {
        id: "\(#nsidBase).\(#params.name).update\(#params.Name)Relationship"
        revision: 1
        description: string | *"update a relationship for \(#params.name)"

        $flexicon: #params.$flexicon

        defs: {
          main: flexicon.#Procedure & {
            $flexicon: action: "rel-update"
            // required permission(s)
            $authzed: string | *"admin"

            input: { 
              encoding: "application/json"
              schema: flexicon.#Object & {
                properties: {
                  subject: flexicon.#String
                  relation: flexicon.#String
                  resource: flexicon.#String
                }
                required: ["subject", "relation", "resource"]
              }
            }
          }
        }
      }

      "delete\(#params.Name)Relationship": flexicon.#Lexicon & {
        id: "\(#nsidBase).\(#params.name).delete\(#params.Name)Relationship"
        revision: 1
        description: string | *"delete a relationship for \(#params.name)"

        $flexicon: #params.$flexicon

        defs: {
          main: flexicon.#Procedure & {
            $flexicon: action: "rel-delete"
            // required permission(s)
            $authzed: string | *"admin"

            input: { 
              encoding: "application/json"
              schema: flexicon.#Object & {
                properties: {
                  subject: flexicon.#String
                  relation: flexicon.#String
                  resource: flexicon.#String
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