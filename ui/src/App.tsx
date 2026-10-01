import React from 'react'
import { createHashHistory, createRouter, RouterProvider } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { routeTree } from './routeTree.gen'

// Use hash history for seamless desktop webview integration
const hashHistory = createHashHistory()

export const router = createRouter({
  routeTree,
  history: hashHistory,
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App
