"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { useSearch } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  handle: z.string().min(2, {
    message: "Handle must be at least 2 characters.",
  }),
  redirect: z.string().optional(),
})

export function HandleForm() {
  const searchParams: any = useSearch({
    strict: false
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      handle: searchParams.handle || "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    if (values.redirect) {
      if (values.redirect.startsWith("/")) {
        // this is a relative path, so we need to make it absolute
        const baseUrl = window.location.origin
        values.redirect = baseUrl + values.redirect
      }
    }

    console.log(values)

    const b = JSON.stringify(values)
    const resp = await fetch(`${import.meta.env.VITE_AUTHR_OAUTH_HOST}/oauth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: b
    })
    const data: any = await resp.json()
    console.log("data:", data)
    if (data.error) {
      // TODO, update form or page...
      alert(data.error)
      return
    }

    // this should always be the case, this is the callback to our auth server (post user approval)
    const redir = data.redirect
    window.location.href = redir
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="handle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Handle</FormLabel>
              <FormControl>
                <Input placeholder="handle.bsky.social" {...field} />
              </FormControl>
              <FormDescription>
                This is your ATProto handle, typically Bluesky.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
