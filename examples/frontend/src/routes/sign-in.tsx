import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { AuthrSignInForm } from "@blebbit/authr-react-tanstack";

// const SignInParams = z.object({
//   handle: z.string().min(2, {
//     message: "Handle must be at least 2 characters.",
//   }).optional(),
//   redirect: z.string().optional(),
// })

export const Route = createFileRoute('/sign-in')({
  component: SignInPage,
  // validateSearch: SignInParams,
})

function SignInPage() {
  return (
    <div className="flex flex-col items-center w-full h-full my-8 gap-16">
      <h3 className="text-2xl font-bold text-center">
        SignIn
      </h3>
      <div className="w-120 mx-auto border rounded-lg shadow-md p-8">
        <AuthrSignInForm />
      </div>
    </div>
  )
}
