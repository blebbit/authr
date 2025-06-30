import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from "@tanstack/react-query"

import {
  APP_BLEBBIT_AUTHR_PAGE_RECORD_DOC,
} from "authr-example-flexicon/common-ts";
import {
  appBlebbitAuthrPageGetPage,
  appBlebbitAuthrFolderGetFolder,
  appBlebbitAuthrPageListPages,
  appBlebbitAuthrFolderListFolders,
} from "authr-example-flexicon/client-ts";

import PageView from "@/components/views/page";
import FolderView from "@/components/views/folder";

export const Route = createFileRoute('/pages/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  // try to get the current id as both a page and folder
  const page = useQuery({
    queryKey: ['page', id],
    queryFn: async () => {
      return appBlebbitAuthrPageGetPage({ id })
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
  const folder = useQuery({
    queryKey: ['folder', id || 'root'],
    queryFn: async () => {
      return appBlebbitAuthrFolderGetFolder({ id })
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const loading = page?.isLoading || folder?.isLoading;
  const error = page?.isError || folder?.isError;

  var item = null;
  if (page?.data?.page) {
    item = page.data.page;
    item["relations"] = page.data.pageRelations
  } else if (folder?.data?.folder) {
    item = folder.data.folder;
    item["relations"] = folder.data.folderRelations
  }

  if (item?.value && typeof item.value === 'string') {
    item.value = JSON.parse(item.value);
  }

  return ( 
    <div className="flex flex-col gap-4 flex-grow p-1 overflow-y-auto overflow-x-hidden">
      { loading ?
        <p>Loading Content...</p>
        :
        item?.nsid === APP_BLEBBIT_AUTHR_PAGE_RECORD_DOC.id ?
        <PageView page={item} />
        :
        <FolderView folder={item} />
      }
    </div>
  )
}
