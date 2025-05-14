import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import Providers from '@/components/providers';
import Layout from '@/components/layout'

export const Route = createRootRoute({
  component: () => (
    <Providers>
      {/* @ts-ignore */}
      <Layout>
        <Outlet />
      </Layout>
      <div className="fixed bottom-0 right-0 z-50">
        <ReactQueryDevtools />
      </div>
      <TanStackRouterDevtools />
    </Providers>
  ),
})
