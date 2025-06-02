package perms

import (
  "list"
  "strings"
)

schemaFile: "./index.zed"

relationships: string & strings.Join(_relationships, "\n")
_relationships: list.FlattenN([
  // groups and role assignment
  [ for g, grp in _groups
    for r, rel in grp
    for s, sub in rel
      { "group:\(g)#\(r)@\(sub)"}
  ],

  // folders role assignment
  [ 
    for f, folder in _folders
    for r, rel in folder if r != "parent" && r != "pages"
    for s, sub in rel
      { "folder:\(f)#\(r)@\(sub)"}
  ],

  // folders hierarchy
  [ 
    for f, folder in _folders if folder.parent != _|_
      { "folder:\(f)#parent@folder:\(folder.parent)"}
  ],

  // folder pages
  [ 
    for f, folder in _folders
    for p, page in folder.pages
      { "page:\(page)#parent@folder:\(f)"}
  ],

], 1)

_users: {
  foo_owner: "user:foo_owner"
  foo_admin: "user:foo_admin"
  foo_member1: "user:foo_member1"
  foo_member2: "user:foo_member2"
  bar_owner: "user:bar_owner"
}

_groups: {
  bar_owners: {
    owner: ["user:bar_owner"]
  }
  foo_owners: {
    owner: ["user:foo_owner"]
  }
  foo_admins: {
    owner: [_users.foo_owner, "group:foo_owners#member"]
    reader: [_users.foo_admin]
  }
  foo_members: {
    owner: ["group:foo_owners#member"]
    editor: ["group:foo_admins#member"]
    reader: [_users.foo_member1, _users.foo_member2]
  }
}

_folders: {
  [string]: {
    parent: string
    pages: [...string] | *[]

    // roles
    owner: [...string] | *[]
    editor: [...string] | *[]
    reviewer: [...string] | *[]
    commenter: [...string] | *[]
    reader: [...string] | *[]

  }
  foo_top: {
    owner: ["group:foo_owners#member"]
    reader: ["group:foo_admins#member"]
  }


  foo_leaf1: {
    parent: "foo_top"
    pages: ["foo_1_a", "foo_1_b"]

    editor: ["group:foo_admins#member"]
  }
  foo_leaf2: {
    parent: "foo_top"
    pages: ["foo_2_a", "foo_2_b", "foo_2_c"]
    editor: ["group:foo_admins#member", "group:foo_members#member"]
  }
}

assertions: {
  assertTrue: [
    "group:foo_owners#owner@user:foo_owner",
    "group:foo_owners#admin@user:foo_owner",

    "group:foo_admins#owner@user:foo_owner",

    "group:foo_members#owner@group:foo_owners#member",
    // "group:foo_members#read@user:foo_owner", // why can't we ask about walked permissions in this section?
    "group:foo_members#read@group:foo_owners#member",
    "group:foo_members#read@user:foo_member1",

    // "page:foo_1_a#read@user:foo_owner",
    "page:foo_1_a#read@group:foo_owners#member",
    "page:foo_2_a#read@group:foo_members#member",
  ]
  assertFalse: [
    "group:foo_members#owner@user:bar_owner",
    "group:foo_owners#admin@user:foo_admin",
    "page:foo_1_a#read@group:foo_members#member",
  ]
}

validation: {

  "group:foo_owners#admin": [
    "[user:foo_owner] is <group:foo_owners#owner>",
  ]
  "group:foo_owners#write": [
    "[user:foo_owner] is <group:foo_owners#owner>",
  ]
  "group:foo_owners#read": [
    "[user:foo_owner] is <group:foo_owners#owner>",
  ]

  "group:foo_admins#admin": [
    "[user:foo_owner] is <group:foo_admins#owner>/<group:foo_owners#owner>",
    "[group:foo_owners#member] is <group:foo_admins#owner>",
  ]
  "group:foo_admins#write": [
    "[user:foo_owner] is <group:foo_admins#owner>/<group:foo_owners#owner>",
    "[group:foo_owners#member] is <group:foo_admins#owner>",
  ]
  "group:foo_admins#read": [
    "[user:foo_owner] is <group:foo_admins#owner>/<group:foo_owners#owner>",
    "[user:foo_admin] is <group:foo_admins#reader>",
    "[group:foo_owners#member] is <group:foo_admins#owner>",
  ]

  "group:foo_members#admin": [
    "[user:foo_owner] is <group:foo_owners#owner>",
    "[group:foo_owners#member] is <group:foo_members#owner>",
  ]
  "group:foo_members#write": [
    "[user:foo_owner] is <group:foo_admins#owner>/<group:foo_owners#owner>",
    "[user:foo_admin] is <group:foo_admins#reader>",
    "[group:foo_owners#member] is <group:foo_admins#owner>/<group:foo_members#owner>",
    "[group:foo_admins#member] is <group:foo_members#editor>",
  ]
  "group:foo_members#read": [
    "[user:foo_owner] is <group:foo_admins#owner>/<group:foo_owners#owner>",
    "[user:foo_admin] is <group:foo_admins#reader>",
    "[group:foo_owners#member] is <group:foo_admins#owner>/<group:foo_members#owner>",
    "[group:foo_admins#member] is <group:foo_members#editor>",
    "[user:foo_member1] is <group:foo_members#reader>",
    "[user:foo_member2] is <group:foo_members#reader>",
  ]

  "page:foo_1_a#read": [
    "[user:foo_owner] is <group:foo_admins#owner>/<group:foo_owners#owner>",
    "[user:foo_admin] is <group:foo_admins#reader>",
    "[group:foo_owners#member] is <folder:foo_top#owner>/<group:foo_admins#owner>",
    "[group:foo_admins#member] is <folder:foo_leaf1#editor>/<folder:foo_top#reader>",
  ]
}

