import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { NodeMenu } from "@/components/widgets/folder-tree/menus";
import { useAuthr } from "@blebbit/authr-react-tanstack";
import { cn } from "@/lib/utils";

export const PageHeader = ({
  page,
  actions,
  dialogRef,
  form,
  basePath,
  mode,
}:{
  page: any
  actions: any
  dialogRef: React.RefObject<any | null>
  form: any
  basePath: string
  mode: 'view' | 'edit'
}) => {
  const authr = useAuthr();

  const isOwner = page?.acct === authr?.session?.did

  return (
    <div className="flex flex-row gap-2 items-center">
      <Link
        to={`${basePath}/${page.parent}`}
        className="text-blue-500 hover:underline"
      ><ChevronLeft className="w-5 h-5"/></Link>
      <span className="text-xl font-light">{page?.value?.name}</span>
      { (page && page?.public) ? (<span className="rounded px-1 py-0 pb-1 text-[.6rem] text-white bg-green-500 inline-block align-middle max-h-4 mb-2">public</span>) : null}
      <div className="mx-1"></div>
      <NodeMenu item={page} dialogRef={dialogRef} {...actions}/>

      { isOwner ? (
        mode === 'edit' ? (
          <>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <button disabled={!canSubmit}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                  }}
                  className={cn(
                    "ml-auto max-w-[200px]",
                    "bg-blue-500 text-white py-1 px-2 rounded",
                    { "bg-blue-300": isSubmitting },
                    { "bg-blue-500/50": !canSubmit },
                  )}
                >
                Save
                </button>
              )}
            />
            <button
              className="bg-gray-300 text-black py-1 px-2 rounded"
              onClick={() => {
                actions.setMode('view');
              }}
            >
              View
            </button>
          </>
        ) : (
          <button
            className="ml-auto bg-gray-300 text-black py-1 px-2 rounded"
            onClick={() => {
              actions.setMode('edit');
            }}
          >
            Edit
          </button>
        )
      ): null }

    </div>
  );
}
