/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as SignInImport } from './routes/sign-in'
import { Route as ProfileImport } from './routes/profile'
import { Route as PagesImport } from './routes/pages'
import { Route as GroupsImport } from './routes/groups'
import { Route as AccountImport } from './routes/account'
import { Route as IndexImport } from './routes/index'
import { Route as PagesIndexImport } from './routes/pages.index'
import { Route as GroupsIndexImport } from './routes/groups.index'
import { Route as ProfileAcctImport } from './routes/profile.$acct'
import { Route as PagesIdImport } from './routes/pages.$id'
import { Route as GroupsNewImport } from './routes/groups.new'
import { Route as GroupsIdImport } from './routes/groups.$id'
import { Route as ProfileAcctIndexImport } from './routes/profile.$acct.index'
import { Route as ProfileAcctPagesImport } from './routes/profile.$acct.pages'
import { Route as ProfileAcctPagesIndexImport } from './routes/profile.$acct.pages.index'
import { Route as ProfileAcctPagesIdImport } from './routes/profile.$acct.pages.$id'

// Create/Update Routes

const SignInRoute = SignInImport.update({
  id: '/sign-in',
  path: '/sign-in',
  getParentRoute: () => rootRoute,
} as any)

const ProfileRoute = ProfileImport.update({
  id: '/profile',
  path: '/profile',
  getParentRoute: () => rootRoute,
} as any)

const PagesRoute = PagesImport.update({
  id: '/pages',
  path: '/pages',
  getParentRoute: () => rootRoute,
} as any)

const GroupsRoute = GroupsImport.update({
  id: '/groups',
  path: '/groups',
  getParentRoute: () => rootRoute,
} as any)

const AccountRoute = AccountImport.update({
  id: '/account',
  path: '/account',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const PagesIndexRoute = PagesIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => PagesRoute,
} as any)

const GroupsIndexRoute = GroupsIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => GroupsRoute,
} as any)

const ProfileAcctRoute = ProfileAcctImport.update({
  id: '/$acct',
  path: '/$acct',
  getParentRoute: () => ProfileRoute,
} as any)

const PagesIdRoute = PagesIdImport.update({
  id: '/$id',
  path: '/$id',
  getParentRoute: () => PagesRoute,
} as any)

const GroupsNewRoute = GroupsNewImport.update({
  id: '/new',
  path: '/new',
  getParentRoute: () => GroupsRoute,
} as any)

const GroupsIdRoute = GroupsIdImport.update({
  id: '/$id',
  path: '/$id',
  getParentRoute: () => GroupsRoute,
} as any)

const ProfileAcctIndexRoute = ProfileAcctIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => ProfileAcctRoute,
} as any)

const ProfileAcctPagesRoute = ProfileAcctPagesImport.update({
  id: '/pages',
  path: '/pages',
  getParentRoute: () => ProfileAcctRoute,
} as any)

const ProfileAcctPagesIndexRoute = ProfileAcctPagesIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => ProfileAcctPagesRoute,
} as any)

const ProfileAcctPagesIdRoute = ProfileAcctPagesIdImport.update({
  id: '/$id',
  path: '/$id',
  getParentRoute: () => ProfileAcctPagesRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/account': {
      id: '/account'
      path: '/account'
      fullPath: '/account'
      preLoaderRoute: typeof AccountImport
      parentRoute: typeof rootRoute
    }
    '/groups': {
      id: '/groups'
      path: '/groups'
      fullPath: '/groups'
      preLoaderRoute: typeof GroupsImport
      parentRoute: typeof rootRoute
    }
    '/pages': {
      id: '/pages'
      path: '/pages'
      fullPath: '/pages'
      preLoaderRoute: typeof PagesImport
      parentRoute: typeof rootRoute
    }
    '/profile': {
      id: '/profile'
      path: '/profile'
      fullPath: '/profile'
      preLoaderRoute: typeof ProfileImport
      parentRoute: typeof rootRoute
    }
    '/sign-in': {
      id: '/sign-in'
      path: '/sign-in'
      fullPath: '/sign-in'
      preLoaderRoute: typeof SignInImport
      parentRoute: typeof rootRoute
    }
    '/groups/$id': {
      id: '/groups/$id'
      path: '/$id'
      fullPath: '/groups/$id'
      preLoaderRoute: typeof GroupsIdImport
      parentRoute: typeof GroupsImport
    }
    '/groups/new': {
      id: '/groups/new'
      path: '/new'
      fullPath: '/groups/new'
      preLoaderRoute: typeof GroupsNewImport
      parentRoute: typeof GroupsImport
    }
    '/pages/$id': {
      id: '/pages/$id'
      path: '/$id'
      fullPath: '/pages/$id'
      preLoaderRoute: typeof PagesIdImport
      parentRoute: typeof PagesImport
    }
    '/profile/$acct': {
      id: '/profile/$acct'
      path: '/$acct'
      fullPath: '/profile/$acct'
      preLoaderRoute: typeof ProfileAcctImport
      parentRoute: typeof ProfileImport
    }
    '/groups/': {
      id: '/groups/'
      path: '/'
      fullPath: '/groups/'
      preLoaderRoute: typeof GroupsIndexImport
      parentRoute: typeof GroupsImport
    }
    '/pages/': {
      id: '/pages/'
      path: '/'
      fullPath: '/pages/'
      preLoaderRoute: typeof PagesIndexImport
      parentRoute: typeof PagesImport
    }
    '/profile/$acct/pages': {
      id: '/profile/$acct/pages'
      path: '/pages'
      fullPath: '/profile/$acct/pages'
      preLoaderRoute: typeof ProfileAcctPagesImport
      parentRoute: typeof ProfileAcctImport
    }
    '/profile/$acct/': {
      id: '/profile/$acct/'
      path: '/'
      fullPath: '/profile/$acct/'
      preLoaderRoute: typeof ProfileAcctIndexImport
      parentRoute: typeof ProfileAcctImport
    }
    '/profile/$acct/pages/$id': {
      id: '/profile/$acct/pages/$id'
      path: '/$id'
      fullPath: '/profile/$acct/pages/$id'
      preLoaderRoute: typeof ProfileAcctPagesIdImport
      parentRoute: typeof ProfileAcctPagesImport
    }
    '/profile/$acct/pages/': {
      id: '/profile/$acct/pages/'
      path: '/'
      fullPath: '/profile/$acct/pages/'
      preLoaderRoute: typeof ProfileAcctPagesIndexImport
      parentRoute: typeof ProfileAcctPagesImport
    }
  }
}

// Create and export the route tree

interface GroupsRouteChildren {
  GroupsIdRoute: typeof GroupsIdRoute
  GroupsNewRoute: typeof GroupsNewRoute
  GroupsIndexRoute: typeof GroupsIndexRoute
}

const GroupsRouteChildren: GroupsRouteChildren = {
  GroupsIdRoute: GroupsIdRoute,
  GroupsNewRoute: GroupsNewRoute,
  GroupsIndexRoute: GroupsIndexRoute,
}

const GroupsRouteWithChildren =
  GroupsRoute._addFileChildren(GroupsRouteChildren)

interface PagesRouteChildren {
  PagesIdRoute: typeof PagesIdRoute
  PagesIndexRoute: typeof PagesIndexRoute
}

const PagesRouteChildren: PagesRouteChildren = {
  PagesIdRoute: PagesIdRoute,
  PagesIndexRoute: PagesIndexRoute,
}

const PagesRouteWithChildren = PagesRoute._addFileChildren(PagesRouteChildren)

interface ProfileAcctPagesRouteChildren {
  ProfileAcctPagesIdRoute: typeof ProfileAcctPagesIdRoute
  ProfileAcctPagesIndexRoute: typeof ProfileAcctPagesIndexRoute
}

const ProfileAcctPagesRouteChildren: ProfileAcctPagesRouteChildren = {
  ProfileAcctPagesIdRoute: ProfileAcctPagesIdRoute,
  ProfileAcctPagesIndexRoute: ProfileAcctPagesIndexRoute,
}

const ProfileAcctPagesRouteWithChildren =
  ProfileAcctPagesRoute._addFileChildren(ProfileAcctPagesRouteChildren)

interface ProfileAcctRouteChildren {
  ProfileAcctPagesRoute: typeof ProfileAcctPagesRouteWithChildren
  ProfileAcctIndexRoute: typeof ProfileAcctIndexRoute
}

const ProfileAcctRouteChildren: ProfileAcctRouteChildren = {
  ProfileAcctPagesRoute: ProfileAcctPagesRouteWithChildren,
  ProfileAcctIndexRoute: ProfileAcctIndexRoute,
}

const ProfileAcctRouteWithChildren = ProfileAcctRoute._addFileChildren(
  ProfileAcctRouteChildren,
)

interface ProfileRouteChildren {
  ProfileAcctRoute: typeof ProfileAcctRouteWithChildren
}

const ProfileRouteChildren: ProfileRouteChildren = {
  ProfileAcctRoute: ProfileAcctRouteWithChildren,
}

const ProfileRouteWithChildren =
  ProfileRoute._addFileChildren(ProfileRouteChildren)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/account': typeof AccountRoute
  '/groups': typeof GroupsRouteWithChildren
  '/pages': typeof PagesRouteWithChildren
  '/profile': typeof ProfileRouteWithChildren
  '/sign-in': typeof SignInRoute
  '/groups/$id': typeof GroupsIdRoute
  '/groups/new': typeof GroupsNewRoute
  '/pages/$id': typeof PagesIdRoute
  '/profile/$acct': typeof ProfileAcctRouteWithChildren
  '/groups/': typeof GroupsIndexRoute
  '/pages/': typeof PagesIndexRoute
  '/profile/$acct/pages': typeof ProfileAcctPagesRouteWithChildren
  '/profile/$acct/': typeof ProfileAcctIndexRoute
  '/profile/$acct/pages/$id': typeof ProfileAcctPagesIdRoute
  '/profile/$acct/pages/': typeof ProfileAcctPagesIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/account': typeof AccountRoute
  '/profile': typeof ProfileRouteWithChildren
  '/sign-in': typeof SignInRoute
  '/groups/$id': typeof GroupsIdRoute
  '/groups/new': typeof GroupsNewRoute
  '/pages/$id': typeof PagesIdRoute
  '/groups': typeof GroupsIndexRoute
  '/pages': typeof PagesIndexRoute
  '/profile/$acct': typeof ProfileAcctIndexRoute
  '/profile/$acct/pages/$id': typeof ProfileAcctPagesIdRoute
  '/profile/$acct/pages': typeof ProfileAcctPagesIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/account': typeof AccountRoute
  '/groups': typeof GroupsRouteWithChildren
  '/pages': typeof PagesRouteWithChildren
  '/profile': typeof ProfileRouteWithChildren
  '/sign-in': typeof SignInRoute
  '/groups/$id': typeof GroupsIdRoute
  '/groups/new': typeof GroupsNewRoute
  '/pages/$id': typeof PagesIdRoute
  '/profile/$acct': typeof ProfileAcctRouteWithChildren
  '/groups/': typeof GroupsIndexRoute
  '/pages/': typeof PagesIndexRoute
  '/profile/$acct/pages': typeof ProfileAcctPagesRouteWithChildren
  '/profile/$acct/': typeof ProfileAcctIndexRoute
  '/profile/$acct/pages/$id': typeof ProfileAcctPagesIdRoute
  '/profile/$acct/pages/': typeof ProfileAcctPagesIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/account'
    | '/groups'
    | '/pages'
    | '/profile'
    | '/sign-in'
    | '/groups/$id'
    | '/groups/new'
    | '/pages/$id'
    | '/profile/$acct'
    | '/groups/'
    | '/pages/'
    | '/profile/$acct/pages'
    | '/profile/$acct/'
    | '/profile/$acct/pages/$id'
    | '/profile/$acct/pages/'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/account'
    | '/profile'
    | '/sign-in'
    | '/groups/$id'
    | '/groups/new'
    | '/pages/$id'
    | '/groups'
    | '/pages'
    | '/profile/$acct'
    | '/profile/$acct/pages/$id'
    | '/profile/$acct/pages'
  id:
    | '__root__'
    | '/'
    | '/account'
    | '/groups'
    | '/pages'
    | '/profile'
    | '/sign-in'
    | '/groups/$id'
    | '/groups/new'
    | '/pages/$id'
    | '/profile/$acct'
    | '/groups/'
    | '/pages/'
    | '/profile/$acct/pages'
    | '/profile/$acct/'
    | '/profile/$acct/pages/$id'
    | '/profile/$acct/pages/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AccountRoute: typeof AccountRoute
  GroupsRoute: typeof GroupsRouteWithChildren
  PagesRoute: typeof PagesRouteWithChildren
  ProfileRoute: typeof ProfileRouteWithChildren
  SignInRoute: typeof SignInRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AccountRoute: AccountRoute,
  GroupsRoute: GroupsRouteWithChildren,
  PagesRoute: PagesRouteWithChildren,
  ProfileRoute: ProfileRouteWithChildren,
  SignInRoute: SignInRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/account",
        "/groups",
        "/pages",
        "/profile",
        "/sign-in"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/account": {
      "filePath": "account.tsx"
    },
    "/groups": {
      "filePath": "groups.tsx",
      "children": [
        "/groups/$id",
        "/groups/new",
        "/groups/"
      ]
    },
    "/pages": {
      "filePath": "pages.tsx",
      "children": [
        "/pages/$id",
        "/pages/"
      ]
    },
    "/profile": {
      "filePath": "profile.tsx",
      "children": [
        "/profile/$acct"
      ]
    },
    "/sign-in": {
      "filePath": "sign-in.tsx"
    },
    "/groups/$id": {
      "filePath": "groups.$id.tsx",
      "parent": "/groups"
    },
    "/groups/new": {
      "filePath": "groups.new.tsx",
      "parent": "/groups"
    },
    "/pages/$id": {
      "filePath": "pages.$id.tsx",
      "parent": "/pages"
    },
    "/profile/$acct": {
      "filePath": "profile.$acct.tsx",
      "parent": "/profile",
      "children": [
        "/profile/$acct/pages",
        "/profile/$acct/"
      ]
    },
    "/groups/": {
      "filePath": "groups.index.tsx",
      "parent": "/groups"
    },
    "/pages/": {
      "filePath": "pages.index.tsx",
      "parent": "/pages"
    },
    "/profile/$acct/pages": {
      "filePath": "profile.$acct.pages.tsx",
      "parent": "/profile/$acct",
      "children": [
        "/profile/$acct/pages/$id",
        "/profile/$acct/pages/"
      ]
    },
    "/profile/$acct/": {
      "filePath": "profile.$acct.index.tsx",
      "parent": "/profile/$acct"
    },
    "/profile/$acct/pages/$id": {
      "filePath": "profile.$acct.pages.$id.tsx",
      "parent": "/profile/$acct/pages"
    },
    "/profile/$acct/pages/": {
      "filePath": "profile.$acct.pages.index.tsx",
      "parent": "/profile/$acct/pages"
    }
  }
}
ROUTE_MANIFEST_END */
