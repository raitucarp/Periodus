import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/settings/')({
  beforeLoad: function redirectToGeneral() {
    throw redirect({ to: '/settings/general' })
  },
})
