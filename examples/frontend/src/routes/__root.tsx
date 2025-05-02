import Layout from '@/components/layout'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
    <Layout>
      <Outlet />
    </Layout>
      <TanStackRouterDevtools />
    </>
  ),
})
