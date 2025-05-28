import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"

const formSchema = z.object({
  public: z.boolean().default(false),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
})

export function NewGroupForm() {

  // 1. Define your form.
  const form = useForm({
    defaultValues: {
      public: false,
    },
    validators: {
      onChange: formSchema,
    },
    // Define what meta values to expect on submission
    onSubmit: async ({ value }: { value: any }) => {
      // Do something with the values passed via handleSubmit
      console.log(`onSubmit:`, value)
      const b = JSON.stringify({
        public: value.public,
        record: {
          name: value.name,
        }
      })

      const resp = await fetch(`${import.meta.env.VITE_XRPC_HOST}/xrpc/app.blebbit.authr.createGroup`, {
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
  })

  return (
    <div>
      <form
        className="space-y-8 flex flex-col gap-1"
        onSubmit={(e) => {
          // console.log("form.onSubmit", e)
          e.preventDefault()
          e.stopPropagation()
        }}
      >

        <form.Field
          // control={form.control}
          name="name"
          children={(field) => (
            <div className="flex flex-col">
              <label
                className="m-1 text-xl font-light"
                htmlFor={field.name}
              >{field.name}</label>
              <input
                className={cn(
                  "border rounded p-2 m-0",
                  !(field.state.meta.isPristine || field.state.meta.isValid) ? "border-red-500" : "border-gray-300",
                )}
                value={field.state.value || ''}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {
                field.state.meta.isBlurred && !field.state.meta.isValid &&
                <em
                  className="m-1 text-red-500"
                  role="alert"
                >{field.state.meta.errors.map((e: any) => e.message).join(', ')}</em>
              }
              {/* <pre>{JSON.stringify(field.state.meta, null, 2)}</pre> */}
            </div>
          )}
        />

        <div className="flex flex-row gap-4">
          <button
            type="submit"
            className="mx-2 px-3 py-1 bg-blue-500 rounded text-white"
            onClick={() => form.handleSubmit()}
          >Create</button>
          <form.Field
            name="public"
            children={(field) => ( 
              <div className="flex flex-row items-center align-middle">
                <Switch
                  checked={field.state.value}
                  onBlur={field.handleBlur}
                  onCheckedChange={(checked) => { 
                    console.log("checked!",checked)
                    return field.handleChange(checked)
                  }}
                  className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-slate-700"
                />
                <span
                  className={cn(
                    "ml-2 my-0 py-0 text-xl pb-1",
                    field.state.value ? "text-green-600" : "text-slate-700"
                  )}
                >{ field.state.value ? "public" : "private" }</span>

                {/* <pre>{JSON.stringify(field.state, null, 2)}</pre> */}
              </div>
            )}
          >
          </form.Field>
        </div>
      </form>
    </div>
  )
}

