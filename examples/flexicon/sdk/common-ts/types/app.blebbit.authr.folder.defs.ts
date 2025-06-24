import { z } from "zod/v4";

export const APP_BLEBBIT_AUTHR_FOLDER_DEFS_DOC = {
  defs: {
    folderForm: {
      properties: {
        name: {
          type: "string",
        },
        public: {
          type: "boolean",
        },
      },
      type: "object",
    },
    folderView: {
      properties: {
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
  description: "Common folder defs for the Authr Example",
  id: "app.blebbit.authr.folder.defs",
  lexicon: 1,
  revision: 1,
};

export type APP_BLEBBIT_AUTHR_FOLDER_DEFS_FOLDER_FORM = {
  name?: string;
  public?: boolean;
};

export const APP_BLEBBIT_AUTHR_FOLDER_DEFS__FOLDER_FORM_SCHEMA = z.object({
  name: z.string().optional(),
  public: z.boolean().optional(),
});

export type APP_BLEBBIT_AUTHR_FOLDER_DEFS_FOLDER_VIEW = {
  cuid?: string;
  name?: string;
  public?: boolean;
};

export const APP_BLEBBIT_AUTHR_FOLDER_DEFS__FOLDER_VIEW_SCHEMA = z.object({
  cuid: z.string().optional(),
  name: z.string().optional(),
  public: z.boolean().optional(),
});

/*
LEX:
    defs:
        folderForm:
            properties:
                name:
                    type: string
                public:
                    type: boolean
            type: object
        folderView:
            properties:
                cuid:
                    type: string
                name:
                    type: string
                public:
                    type: boolean
            type: object
    description: Common folder defs for the Authr Example
    id: app.blebbit.authr.folder.defs
    lexicon: 1
    revision: 1
Lexicon:
    - $authzed:
        permissions:
            admin: owner + parent->admin
            comment: commenter + feedback + parent->comment
            feedback: reviewer + write + parent->feedback
            read: reader + comment + parent->read
            write: editor + admin + parent->write
        relations:
            commenter:
                - user
                - group#member
            editor:
                - user
                - group#member
            owner:
                - user
                - group#member
            parent:
                - folder
            reader:
                - user
                - group#member
            reviewer:
                - user
                - group#member
      defs: {}
      description: Relations and permissions available on folders for the Authr Example
      id: app.blebbit.authr.folder.authzed
      lexicon: 1
      revision: 1
    - defs:
        folderForm:
            properties:
                name:
                    type: string
                public:
                    type: boolean
            type: object
        folderView:
            properties:
                cuid:
                    type: string
                name:
                    type: string
                public:
                    type: boolean
            type: object
      description: Common folder defs for the Authr Example
      id: app.blebbit.authr.folder.defs
      lexicon: 1
      revision: 1
    - defs:
        main:
            key: tid
            record:
                properties:
                    cuid:
                        type: string
                    name:
                        type: string
                    public:
                        type: boolean
                type: object
            type: record
      description: Lexicon for folders on Authr Example
      id: app.blebbit.authr.folder.record
      lexicon: 1
      revision: 1
    - $authzed:
        permissions:
            admin: owner + parent->admin
            member: owner + editor + reader
            read: reader + write + parent->read
            write: editor + admin + parent->write
        relations:
            editor:
                - user
                - group#member
            owner:
                - user
                - group#member
            parent:
                - group
            reader:
                - user
                - group#member
      defs: {}
      description: Relations and permissions available on groups for the Authr Example
      id: app.blebbit.authr.group.authzed
      lexicon: 1
      revision: 1
    - defs:
        groupForm:
            properties:
                description:
                    type: string
                display:
                    type: string
                name:
                    type: string
                public:
                    type: boolean
            required:
                - name
            type: object
        groupView:
            properties:
                cuid:
                    type: string
                description:
                    type: string
                display:
                    type: string
                name:
                    type: string
                public:
                    type: boolean
            type: object
      description: Common defs for the Authr Example
      id: app.blebbit.authr.group.defs
      lexicon: 1
      revision: 1
    - defs:
        main:
            key: tid
            record:
                properties:
                    cuid:
                        type: string
                    description:
                        type: string
                    display:
                        type: string
                    name:
                        type: string
                    public:
                        type: boolean
                type: object
            type: record
      description: Lexicon for groups on Authr Example
      id: app.blebbit.authr.group.record
      lexicon: 1
      revision: 1
    - $authzed:
        permissions:
            admin: owner + parent->admin
            comment: commenter + feedback + parent->comment
            feedback: reviewer + write + parent->feedback
            read: reader + comment + parent->read
            write: editor + admin + parent->write
        relations:
            commenter:
                - user
                - group#member
            editor:
                - user
                - group#member
            owner:
                - user
                - group#member
            parent:
                - folder
            reader:
                - user
                - group#member
            reviewer:
                - user
                - group#member
      defs: {}
      description: Relations and permissions available on pages for the Authr Example
      id: app.blebbit.authr.page.authzed
      lexicon: 1
      revision: 1
    - defs:
        pageForm:
            properties:
                name:
                    type: string
                public:
                    type: boolean
            type: object
        pageView:
            properties:
                content:
                    type: string
                cuid:
                    type: string
                name:
                    type: string
                public:
                    type: boolean
            type: object
      description: Common page defs for the Authr Example
      id: app.blebbit.authr.page.defs
      lexicon: 1
      revision: 1
    - defs:
        main:
            key: tid
            record:
                properties:
                    content:
                        type: string
                    cuid:
                        type: string
                    name:
                        type: string
                    public:
                        type: boolean
                type: object
            type: record
      description: Lexicon for pages on Authr Example
      id: app.blebbit.authr.page.record
      lexicon: 1
      revision: 1
    - $flexicon:
        lname: group
        lplural: groups
      defs:
        main:
            $authzed: read
            $flexicon:
                action: get
            output:
                encoding: application/json
                schema:
                    properties:
                        cuid:
                            type: string
                        description:
                            type: string
                        display:
                            type: string
                        name:
                            type: string
                        public:
                            type: boolean
                    type: object
            parameters:
                properties:
                    id:
                        type: string
                required:
                    - id
                type: params
            type: query
      description: get a group by id
      id: app.blebbit.authr.group.getGroup
      lexicon: 1
      revision: 1
    - $flexicon:
        lname: group
        lplural: groups
      defs:
        main:
            $authzed: read
            $flexicon:
                action: list
            output:
                encoding: application/json
                schema:
                    properties:
                        groups:
                            items:
                                properties:
                                    cuid:
                                        type: string
                                    description:
                                        type: string
                                    display:
                                        type: string
                                    name:
                                        type: string
                                    public:
                                        type: boolean
                                type: object
                            type: array
                    type: object
            parameters:
                properties:
                    cursor:
                        type: string
                    limit:
                        type: integer
                type: params
            type: query
      description: get a group list
      id: app.blebbit.authr.group.listGroups
      lexicon: 1
      revision: 1
    - $flexicon:
        lname: group
        lplural: groups
      defs:
        main:
            $authzed: admin
            $flexicon:
                action: create
            input:
                encoding: application/json
                schema:
                    properties:
                        description:
                            type: string
                        display:
                            type: string
                        name:
                            type: string
                        public:
                            type: boolean
                    required:
                        - name
                    type: object
            output:
                encoding: application/json
                schema:
                    properties:
                        cuid:
                            type: string
                        description:
                            type: string
                        display:
                            type: string
                        name:
                            type: string
                        public:
                            type: boolean
                    type: object
            type: procedure
      description: create a group
      id: app.blebbit.authr.group.createGroup
      lexicon: 1
      revision: 1
    - $flexicon:
        lname: group
        lplural: groups
      defs:
        main:
            $authzed: admin
            $flexicon:
                action: update
            input:
                encoding: application/json
                schema:
                    properties:
                        description:
                            type: string
                        display:
                            type: string
                        name:
                            type: string
                        public:
                            type: boolean
                    required:
                        - name
                    type: object
            output:
                encoding: application/json
                schema:
                    properties:
                        cuid:
                            type: string
                        description:
                            type: string
                        display:
                            type: string
                        name:
                            type: string
                        public:
                            type: boolean
                    type: object
            parameters:
                properties:
                    id:
                        type: string
                type: params
            type: procedure
      description: update a group
      id: app.blebbit.authr.group.updateGroup
      lexicon: 1
      revision: 1
    - $flexicon:
        lname: group
        lplural: groups
      defs:
        main:
            $authzed: admin
            $flexicon:
                action: delete
            parameters:
                properties:
                    id:
                        type: string
                type: params
            type: procedure
      description: delete a group
      id: app.blebbit.authr.group.deleteGroup
      lexicon: 1
      revision: 1
    - $flexicon:
        lname: page
        lplural: pages
      defs:
        main:
            $authzed: read
            $flexicon:
                action: get
            output:
                encoding: application/json
                schema:
                    properties:
                        content:
                            type: string
                        cuid:
                            type: string
                        name:
                            type: string
                        public:
                            type: boolean
                    type: object
            parameters:
                properties:
                    id:
                        type: string
                required:
                    - id
                type: params
            type: query
      description: get a page by id
      id: app.blebbit.authr.page.getPage
      lexicon: 1
      revision: 1
    - $flexicon:
        lname: page
        lplural: pages
      defs:
        main:
            $authzed: read
            $flexicon:
                action: list
            output:
                encoding: application/json
                schema:
                    properties:
                        pages:
                            items:
                                properties:
                                    content:
                                        type: string
                                    cuid:
                                        type: string
                                    name:
                                        type: string
                                    public:
                                        type: boolean
                                type: object
                            type: array
                    type: object
            parameters:
                properties:
                    cursor:
                        type: string
                    limit:
                        type: integer
                type: params
            type: query
      description: get a page list
      id: app.blebbit.authr.page.listPages
      lexicon: 1
      revision: 1
    - $flexicon:
        lname: page
        lplural: pages
      defs:
        main:
            $authzed: admin
            $flexicon:
                action: create
            input:
                encoding: application/json
                schema:
                    properties:
                        name:
                            type: string
                        public:
                            type: boolean
                    type: object
            output:
                encoding: application/json
                schema:
                    properties:
                        content:
                            type: string
                        cuid:
                            type: string
                        name:
                            type: string
                        public:
                            type: boolean
                    type: object
            type: procedure
      description: create a page
      id: app.blebbit.authr.page.createPage
      lexicon: 1
      revision: 1
    - $flexicon:
        lname: page
        lplural: pages
      defs:
        main:
            $authzed: admin
            $flexicon:
                action: update
            input:
                encoding: application/json
                schema:
                    properties:
                        name:
                            type: string
                        public:
                            type: boolean
                    type: object
            output:
                encoding: application/json
                schema:
                    properties:
                        content:
                            type: string
                        cuid:
                            type: string
                        name:
                            type: string
                        public:
                            type: boolean
                    type: object
            parameters:
                properties:
                    id:
                        type: string
                type: params
            type: procedure
      description: update a page
      id: app.blebbit.authr.page.updatePage
      lexicon: 1
      revision: 1
    - $flexicon:
        lname: page
        lplural: pages
      defs:
        main:
            $authzed: admin
            $flexicon:
                action: delete
            parameters:
                properties:
                    id:
                        type: string
                type: params
            type: procedure
      description: delete a page
      id: app.blebbit.authr.page.deletePage
      lexicon: 1
      revision: 1
    - $flexicon:
        lname: group
        lplural: groups
      defs:
        main:
            $authzed: admin
            $flexicon:
                action: rel-list
            output:
                encoding: application/json
                schema:
                    properties:
                        groups:
                            items:
                                properties:
                                    relation:
                                        type: string
                                    resource:
                                        type: string
                                    subject:
                                        type: string
                                type: object
                            type: array
                    type: object
            parameters:
                properties:
                    cursor:
                        type: string
                    id:
                        type: string
                    limit:
                        type: integer
                type: params
            type: query
      description: get a list of relationships for a group
      id: app.blebbit.authr.group.listGroupRelationships
      lexicon: 1
      revision: 1
    - $flexicon:
        lname: group
        lplural: groups
      defs:
        main:
            $authzed: admin
            $flexicon:
                action: rel-create
            input:
                encoding: application/json
                schema:
                    properties:
                        relation:
                            type: string
                        resource:
                            type: string
                        subject:
                            type: string
                    required:
                        - subject
                        - relation
                        - resource
                    type: object
            type: procedure
      description: create a relationship for group
      id: app.blebbit.authr.group.createGroupRelationship
      lexicon: 1
      revision: 1
    - $flexicon:
        lname: group
        lplural: groups
      defs:
        main:
            $authzed: admin
            $flexicon:
                action: rel-update
            input:
                encoding: application/json
                schema:
                    properties:
                        relation:
                            type: string
                        resource:
                            type: string
                        subject:
                            type: string
                    required:
                        - subject
                        - relation
                        - resource
                    type: object
            type: procedure
      description: update a relationship for group
      id: app.blebbit.authr.group.updateGroupRelationship
      lexicon: 1
      revision: 1
    - $flexicon:
        lname: group
        lplural: groups
      defs:
        main:
            $authzed: admin
            $flexicon:
                action: rel-delete
            input:
                encoding: application/json
                schema:
                    properties:
                        relation:
                            type: string
                        resource:
                            type: string
                        subject:
                            type: string
                    required:
                        - subject
                        - resource
                    type: object
            type: procedure
      description: delete a relationship for group
      id: app.blebbit.authr.group.deleteGroupRelationship
      lexicon: 1
      revision: 1
    - $flexicon:
        lname: page
        lplural: pages
      defs:
        main:
            $authzed: admin
            $flexicon:
                action: rel-list
            output:
                encoding: application/json
                schema:
                    properties:
                        pages:
                            items:
                                properties:
                                    relation:
                                        type: string
                                    resource:
                                        type: string
                                    subject:
                                        type: string
                                type: object
                            type: array
                    type: object
            parameters:
                properties:
                    cursor:
                        type: string
                    id:
                        type: string
                    limit:
                        type: integer
                type: params
            type: query
      description: get a list of relationships for a page
      id: app.blebbit.authr.page.listPageRelationships
      lexicon: 1
      revision: 1
    - $flexicon:
        lname: page
        lplural: pages
      defs:
        main:
            $authzed: admin
            $flexicon:
                action: rel-create
            input:
                encoding: application/json
                schema:
                    properties:
                        relation:
                            type: string
                        resource:
                            type: string
                        subject:
                            type: string
                    required:
                        - subject
                        - relation
                        - resource
                    type: object
            type: procedure
      description: create a relationship for page
      id: app.blebbit.authr.page.createPageRelationship
      lexicon: 1
      revision: 1
    - $flexicon:
        lname: page
        lplural: pages
      defs:
        main:
            $authzed: admin
            $flexicon:
                action: rel-update
            input:
                encoding: application/json
                schema:
                    properties:
                        relation:
                            type: string
                        resource:
                            type: string
                        subject:
                            type: string
                    required:
                        - subject
                        - relation
                        - resource
                    type: object
            type: procedure
      description: update a relationship for page
      id: app.blebbit.authr.page.updatePageRelationship
      lexicon: 1
      revision: 1
    - $flexicon:
        lname: page
        lplural: pages
      defs:
        main:
            $authzed: admin
            $flexicon:
                action: rel-delete
            input:
                encoding: application/json
                schema:
                    properties:
                        relation:
                            type: string
                        resource:
                            type: string
                        subject:
                            type: string
                    required:
                        - subject
                        - resource
                    type: object
            type: procedure
      description: delete a relationship for page
      id: app.blebbit.authr.page.deletePageRelationship
      lexicon: 1
      revision: 1
    - $flexicon:
        lname: folder
        lplural: folders
      defs:
        main:
            $authzed: read
            $flexicon:
                action: get
            output:
                encoding: application/json
                schema:
                    properties:
                        cuid:
                            type: string
                        name:
                            type: string
                        public:
                            type: boolean
                    type: object
            parameters:
                properties:
                    id:
                        type: string
                required:
                    - id
                type: params
            type: query
      description: get a folder by id
      id: app.blebbit.authr.folder.getFolder
      lexicon: 1
      revision: 1
    - $flexicon:
        lname: folder
        lplural: folders
      defs:
        main:
            $authzed: read
            $flexicon:
                action: list
            output:
                encoding: application/json
                schema:
                    properties:
                        folders:
                            items:
                                properties:
                                    cuid:
                                        type: string
                                    name:
                                        type: string
                                    public:
                                        type: boolean
                                type: object
                            type: array
                    type: object
            parameters:
                properties:
                    cursor:
                        type: string
                    limit:
                        type: integer
                type: params
            type: query
      description: get a folder list
      id: app.blebbit.authr.folder.listFolders
      lexicon: 1
      revision: 1
    - $flexicon:
        lname: folder
        lplural: folders
      defs:
        main:
            $authzed: admin
            $flexicon:
                action: create
            input:
                encoding: application/json
                schema:
                    properties:
                        name:
                            type: string
                        public:
                            type: boolean
                    type: object
            output:
                encoding: application/json
                schema:
                    properties:
                        cuid:
                            type: string
                        name:
                            type: string
                        public:
                            type: boolean
                    type: object
            type: procedure
      description: create a folder
      id: app.blebbit.authr.folder.createFolder
      lexicon: 1
      revision: 1
    - $flexicon:
        lname: folder
        lplural: folders
      defs:
        main:
            $authzed: admin
            $flexicon:
                action: update
            input:
                encoding: application/json
                schema:
                    properties:
                        name:
                            type: string
                        public:
                            type: boolean
                    type: object
            output:
                encoding: application/json
                schema:
                    properties:
                        cuid:
                            type: string
                        name:
                            type: string
                        public:
                            type: boolean
                    type: object
            parameters:
                properties:
                    id:
                        type: string
                type: params
            type: procedure
      description: update a folder
      id: app.blebbit.authr.folder.updateFolder
      lexicon: 1
      revision: 1
    - $flexicon:
        lname: folder
        lplural: folders
      defs:
        main:
            $authzed: admin
            $flexicon:
                action: delete
            parameters:
                properties:
                    id:
                        type: string
                type: params
            type: procedure
      description: delete a folder
      id: app.blebbit.authr.folder.deleteFolder
      lexicon: 1
      revision: 1
    - $flexicon:
        lname: folder
        lplural: folders
      defs:
        main:
            $authzed: admin
            $flexicon:
                action: rel-list
            output:
                encoding: application/json
                schema:
                    properties:
                        folders:
                            items:
                                properties:
                                    relation:
                                        type: string
                                    resource:
                                        type: string
                                    subject:
                                        type: string
                                type: object
                            type: array
                    type: object
            parameters:
                properties:
                    cursor:
                        type: string
                    id:
                        type: string
                    limit:
                        type: integer
                type: params
            type: query
      description: get a list of relationships for a folder
      id: app.blebbit.authr.folder.listFolderRelationships
      lexicon: 1
      revision: 1
    - $flexicon:
        lname: folder
        lplural: folders
      defs:
        main:
            $authzed: admin
            $flexicon:
                action: rel-create
            input:
                encoding: application/json
                schema:
                    properties:
                        relation:
                            type: string
                        resource:
                            type: string
                        subject:
                            type: string
                    required:
                        - subject
                        - relation
                        - resource
                    type: object
            type: procedure
      description: create a relationship for folder
      id: app.blebbit.authr.folder.createFolderRelationship
      lexicon: 1
      revision: 1
    - $flexicon:
        lname: folder
        lplural: folders
      defs:
        main:
            $authzed: admin
            $flexicon:
                action: rel-update
            input:
                encoding: application/json
                schema:
                    properties:
                        relation:
                            type: string
                        resource:
                            type: string
                        subject:
                            type: string
                    required:
                        - subject
                        - relation
                        - resource
                    type: object
            type: procedure
      description: update a relationship for folder
      id: app.blebbit.authr.folder.updateFolderRelationship
      lexicon: 1
      revision: 1
    - $flexicon:
        lname: folder
        lplural: folders
      defs:
        main:
            $authzed: admin
            $flexicon:
                action: rel-delete
            input:
                encoding: application/json
                schema:
                    properties:
                        relation:
                            type: string
                        resource:
                            type: string
                        subject:
                            type: string
                    required:
                        - subject
                        - resource
                    type: object
            type: procedure
      description: delete a relationship for folder
      id: app.blebbit.authr.folder.deleteFolderRelationship
      lexicon: 1
      revision: 1

*/
