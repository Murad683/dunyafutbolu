import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/article/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/article/"!</div>
}
