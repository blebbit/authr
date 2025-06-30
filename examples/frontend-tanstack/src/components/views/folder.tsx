import { useRef } from "react";
import { useQuery } from "@tanstack/react-query"
import { useNavigate, Link } from "@tanstack/react-router";

import { 
  appBlebbitAuthrPageListPages,
  appBlebbitAuthrFolderListFolders,
} from "authr-example-flexicon/client-ts";

import { createActions } from "@/components/views/actions";

import { authrItemToTreeDataItem } from "@/lib/trans"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialogs } from '@/components/widgets/dialogs';
import { TreeMenu, NodeMenu } from "@/components/widgets/folder-tree/menus";
import { FolderJson } from "@/components/widgets/folder/json";

import { ChevronLeft, Folder, StickyNote } from "lucide-react"

const FolderView = ({
  folder,
  account,
}:{
  folder?: any
  account?: string
}) => {
  const dialogRef = useRef<any | null>(null);

  const basePath = account ? `/profile/${account}/pages` : `/pages`;

  // setup opts for fetching children
  const opts = {}
  if (folder) {
    opts['parent'] = folder.id
  }
  if (account) {
    opts['account'] = account;
  }

  // fetch children of the folder
  const pages = useQuery({
    queryKey: ['pages', folder?.id || 'root'],
    queryFn: async () => {
      // console.log("Fetching pages for folder:", folder?.id || 'root', opts);
      return appBlebbitAuthrPageListPages(opts)
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
  const folders = useQuery({
    queryKey: ['folders', folder?.id || 'root'],
    queryFn: async () => {
      // console.log("Fetching folders for folder:", folder?.id || 'root', opts);
      return appBlebbitAuthrFolderListFolders(opts)
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // console.log("FolderView.queries:", pages, folders)

  const isLoading = pages.isLoading || folders.isLoading;
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }

  if (folders?.error || pages?.error) {
    console.error("Error in folders or pages:", folders?.error, pages?.error);
    return (
      <div className="flex flex-col gap-4">
        <p>Error:</p>
        <p>{folders?.error?.message}</p>
        <p>{pages?.error?.message}</p>
      </div>
    )
  }

  const actions = createActions(dialogRef)

  // handle results
  // const pageData = pages?.data?.pages as any[] || []
  // const folderData = folders?.data?.folders as any[] || []
  // const items = [...folderData, ...pageData];
  const folderItems = folders?.data?.folders.map(authrItemToTreeDataItem);
  const pageItems = pages?.data?.pages.map(authrItemToTreeDataItem);

  const items = [...folderItems, ...pageItems];

  return (
    <div className="flex flex-col gap-4 flex-grow p-2">
      <FolderHeader
        folder={folder}
        actions={actions}
        dialogRef={dialogRef}
        basePath={basePath}
      />
      <div className="flex flex-col gap-4">
        <span>Folders</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          { folderItems.map((item) => (
              <FolderPreview key={item.id} folder={item} basePath={basePath} />
          ))}
        </div>
        <span>Pages</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          { pageItems.map((item) => (
              <PagePreview key={item.id} page={item} basePath={basePath} />
          ))}
        </div>
        <hr />
      </div>
      <FolderJson folder={folder} items={items} />

      <Dialogs 
        ref={dialogRef}
        {...actions}
      />
    </div>
  );
}

const FolderHeader = ({
  folder,
  actions,
  dialogRef,
  basePath,
}:{
  folder: any
  actions: any
  dialogRef: React.RefObject<any | null>
  basePath: string
}) => {
  return (
    <div className="flex flex-row gap-2 items-center jusify-between">
      { folder && (
        <Link
          to={`${basePath}/${folder.parent}`}
          className="text-blue-500 hover:underline"
        ><ChevronLeft className="w-5 h-5"/></Link>
      )}
      <span className="text-xl font-light">{folder?.value?.name || "Folders & Pages"}</span>
      { (folder && folder?.public) ? (<span className="rounded px-1 py-0 pb-1 text-[.6rem] text-white bg-green-500 inline-block align-middle max-h-4 mb-2">public</span>) : null}
      <div className="mx-1"></div>
      { folder ? (
        <NodeMenu item={folder} dialogRef={dialogRef} {...actions}/>
      ) : (
        <TreeMenu dialogRef={dialogRef} />
      )}
    </div>
  );
}

const FolderPreview = ({
  folder,
  basePath,
}:{
  folder: any
  basePath: string
}) => {
  const navigate = useNavigate();
  // console.log("FolderPreview.folder:", folder);
  return (
    <div
      className="flex gap-4 p-2 items-center border rounded-md bg-muted hover:bg-blue-500/50 hover:cursor-pointer"
      onClick={() => navigate({ to: `${basePath}/${folder.id}` })}
    >
      <Folder className="h-6 w-6" strokeWidth={1.5} />
      <span className="font-light">{folder.value.name}</span>
    </div>
  )
}

const PagePreview = ({
  page,
  basePath,
}:{
  page: any
  basePath: string
}) => {
  const navigate = useNavigate();
  // console.log("PagePreview.page:", page);
  return (
    <div
      className="flex gap-4 p-2 items-center border rounded-md bg-muted hover:bg-blue-500/50 hover:cursor-pointer"
      onClick={() => navigate({ to: `${basePath}/${page.id}` })}
    >
      <StickyNote className="h-6 w-6" strokeWidth={1.5} />
      <span className="font-light">{page.value.name}</span>
    </div>
  )
} 

export default FolderView;