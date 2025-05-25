import { createFileRoute } from '@tanstack/react-router'
import logo from '../logo.svg'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="text-center h-full flex-grow flex flex-col items-center justify-center p-4 gap-8">
      <h1 className="text-6xl">@Blebbit Authr</h1>
      <h3 className="text-2xl font-light">Authentication, Authorization, and Permissions Service</h3>
      <span className="font-light text-lg">
        <a href="https://github.com/blebbit/authr" target="_blank" rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700 hover:underline"
        >
          https://github.com/blebbit/authr
        </a>
      </span>
      <span className="font-light text-lg p-8">
        This is a demo app for the Authr identity and permission management service.
        It demonstrates how to use Authr with Vite, React, and TanStack.
      </span>

    </div>
  )
}
