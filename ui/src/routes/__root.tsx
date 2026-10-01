import React from 'react'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { AmbientBackground } from '@/components/common/ambient'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <AmbientBackground>
      <Outlet />
    </AmbientBackground>
  )
}
