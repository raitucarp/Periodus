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

import { useEffect } from 'react'
import { Window } from '@wailsio/runtime'
import { isWailsEnv } from '@/lib/bindings'

export function App() {
  useEffect(() => {
    if (isWailsEnv()) {
      try {
        Window.Maximise()
      } catch {
        // ignore
      }
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App
