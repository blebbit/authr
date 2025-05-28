import { useForm } from '@tanstack/react-form'

type FormMeta = {
  submitAction: 'continue' | 'backToMenu' | null
}

// Metadata is not required to call form.handleSubmit().
// Specify what values to use as default if no meta is passed
const defaultMeta: FormMeta = {
  submitAction: null,
}

export function MultiSubmitForm() {
  const form = useForm({
    defaultValues: {
      data: '',
    },
    // Define what meta values to expect on submission
    onSubmitMeta: defaultMeta,
    onSubmit: async ({ value, meta }) => {
      // Do something with the values passed via handleSubmit
      console.log(`Selected action - ${meta.submitAction}`, value)
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      {/* ... */}
      <div className="flex flex-row justify-between">
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded"
          // Overwrites the default specified in onSubmitMeta
          onClick={() => form.handleSubmit({ submitAction: 'continue' })}
        >
          Submit and continue
        </button>
        <button
          type="submit"
          className="bg-red-500 text-white p-2 rounded"
          onClick={() => form.handleSubmit({ submitAction: 'backToMenu' })}
        >
          Submit and back to menu
        </button>
      </div>
    </form>
  )
}
