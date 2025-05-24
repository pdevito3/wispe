import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/party-time')({
  component: About,
})

function About() {
  return <div className="p-2">Party time 🎉</div>
}