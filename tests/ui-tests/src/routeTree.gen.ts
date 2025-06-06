/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as PartyTimeImport } from './routes/party-time'
import { Route as IndexImport } from './routes/index'

// Create/Update Routes

const PartyTimeRoute = PartyTimeImport.update({
  id: '/party-time',
  path: '/party-time',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
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
    '/party-time': {
      id: '/party-time'
      path: '/party-time'
      fullPath: '/party-time'
      preLoaderRoute: typeof PartyTimeImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/party-time': typeof PartyTimeRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/party-time': typeof PartyTimeRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/party-time': typeof PartyTimeRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/party-time'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/party-time'
  id: '__root__' | '/' | '/party-time'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  PartyTimeRoute: typeof PartyTimeRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  PartyTimeRoute: PartyTimeRoute,
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
        "/party-time"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/party-time": {
      "filePath": "party-time.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
