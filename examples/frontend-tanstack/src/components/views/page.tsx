import { useRef, useState } from "react";
import {
  useForm,
} from '@tanstack/react-form'

import { Dialogs } from '@/components/widgets/dialogs';
import { createActions } from "@/components/views/actions";

import { 
  PageHeader,
  PageBody,
  PageJson,
  PageEdit,
} from "@/components/widgets/page";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const PageView = ({
  page,
  account,
}:{
  // page: APP_BLEBBIT_AUTHR_PAGE_GET_PAGE_OUTPUT
  page: any
  account?: string
}) => {
  const queryClient = useQueryClient()
  const dialogRef = useRef<any | null>(null);
  const actions = createActions(dialogRef)
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const savePage = useMutation({
    mutationFn: async (value: any) => {
      // Here you would typically call an API to save the page
      console.log("Saving page:", page, value);

      await actions.savePageContent(page.id, value.content); // Call the action to save content
      // optimistic update
      page.value.content = value.content; // Update the page content

      queryClient.invalidateQueries({ queryKey: ['page', page.id] }); // Invalidate the page query to refetch it

      return page; // Simulate a successful save
    },
    onSuccess: (data) => {
      console.log("Page saved successfully:", data);
      setMode('view'); // Switch back to view mode after saving
    },
    onError: (error) => {
      console.error("Error saving page:", error);
    }
  });

  const form = useForm({
    defaultValues: {
      content: page?.value?.content || '',
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(value)
      savePage.mutate(value);
    },
  })

  actions["setMode"] = setMode;

  const basePath = account ? `/profile/${account}/pages` : `/pages`;

  return (
    <div className="flex flex-col gap-4 p-2 [&>pre]:border [&>pre]:p-2 [&>pre]:bg-muted [&>pre]:rounded">

      <PageHeader page={page} dialogRef={dialogRef} form={form} actions={actions} basePath={basePath} mode={mode}/>

      { mode === 'view' ? (
        <PageBody page={page} />
      ) : (
        <PageEdit form={form} />
      )}

      <hr />
      <PageJson page={page} />

      <Dialogs 
        ref={dialogRef}
        {...actions}
      />
    </div>
  );
}


export default PageView;