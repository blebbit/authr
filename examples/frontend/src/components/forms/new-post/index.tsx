"use client"

import { useForm } from "@tanstack/react-form"
import { z } from "zod"

import { useSearch } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  content: z.string().min(2, {
    message: "Content must be at least 2 characters.",
  }),
})

type FormMeta = {
  submitAction: 'post' | 'draft' | null
}

const defaultMeta: FormMeta = {
  submitAction: null,
}


export function HandleForm() {
  const searchParams: any = useSearch({
    strict: false
  });

  // 1. Define your form.
  const form = useForm({
    validators: {
      onChange: formSchema,
    },
    // Define what meta values to expect on submission
    onSubmitMeta: defaultMeta,
    onSubmit: async ({ value, meta }: { value: any, meta: FormMeta }) => {
      // Do something with the values passed via handleSubmit
      value.action = meta.submitAction
      console.log(`onSubmit:`, value)
      const b = JSON.stringify(value)

      const resp = await fetch(`${import.meta.env.VITE_AUTHR_OAUTH_HOST}/xrpc/app.blebbit.authr.createPost`, {
        method: "POST",
        credentials: "include",
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
    },

    // onSubmit: async ({ values, meta }: { values: z.infer<typeof formSchema>, meta: any }) => {
    // },
  })

  return (
    <div>
      <form
        className="space-y-8 flex flex-col"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        <form.Field
          // control={form.control}
          name="title"
          children={(field) => (
<>
      <input
        className="border rounded p-2"
        value={field.state.value || ''}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {/* <FieldInfo field={field} /> */}
    </>
          )}
        />
        <form.Field
          // control={form.control}
          name="content"
          children={(field) => (
<>
      <textarea
        rows={10}
        className="border rounded p-2"
        value={field.state.value || ''}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {/* <FieldInfo field={field} /> */}
    </>
          )}
        />
        <div className="flex flex-row">
          <Button
            type="submit"
            variant="default"
            className="mx-2"
            onClick={() => form.handleSubmit({ submitAction: 'post' })}
          >Post Live</Button>
          <Button
            type="submit"
            variant="outline"
            className="mx-2"
            onClick={() => form.handleSubmit({ submitAction: 'draft' })}
          >Save Draft</Button>
        </div>
      </form>
    </div>
  )
}

