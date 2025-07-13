import {
  type AnyFieldApi,
  useForm,
} from '@tanstack/react-form'
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from "rehype-sanitize";


import * as commands from "@uiw/react-md-editor/commands"

import { cn } from '@/lib/utils'

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em>{field.state.meta.errors.join(', ')}</em>
      ) : null}
      {field.state.meta.isValidating ? 'Validating...' : null}
    </>
  )
}

export const PageEdit = ({
  form,
}: {
  form?: any,
}) => {

  return (
    <div className="flex flex-col gap-4 p-2">
     <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <div className="flex flex-col gap-2">
          {/* A type-safe field component*/}
          <form.Field
            name="content"
            validators={{
              onChange: ({ value }) =>
                !value
                  ? 'Content is required'
                  : value.length < 3
                    ? 'Content must be at least 3 characters'
                    : undefined,
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: async ({ value }) => {
                await new Promise((resolve) => setTimeout(resolve, 100))
                return (
                  value.includes('error') && 'No "error" allowed in content'
                )
              },
            }}
            children={(field) => {
              // Avoid hasty abstractions. Render props are great!
              return (
                <>
                  <div className="flex flex-row gap-2 items-center">
                    <span className="min-h-6"></span>
                    <span className="ml-auto mr-8">
                      <FieldInfo field={field}/>
                    </span>
                  </div>
                    <div className="container">
                      <MDEditor
                        id={field.name}
                        name={field.name}

                        className="border p-2 rounded h-full"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(val) => {
                          // console.log('onChange', val)
                          field.handleChange(val)
                        }}
                        previewOptions={{
                          rehypePlugins: [[rehypeSanitize]],
                        }}
                      />
                    </div>
                </>
              )
            }}
          />
        </div>
      </form>

    </div>
  );
}