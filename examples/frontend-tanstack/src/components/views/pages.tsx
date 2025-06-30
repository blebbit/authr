import { useRef } from "react";
import { useNavigate, Outlet } from "@tanstack/react-router";

import { useAuthr } from "@blebbit/authr-react-tanstack";

import FolderTree from "@/components/widgets/folder-tree";
import { TreeMenu } from "@/components/widgets/folder-tree/menus";

const PagesLayout = ({
  account,
}: {
  account?: string
}) => {

  const basePath = account ? `/profile/${account}/pages` : `/pages`;

  const dialogRef = useRef<any | null>(null);
  const navigate = useNavigate({})
  const authr = useAuthr();

  return (
    <div className="flex flex-row flex-grow items-stretch">
      <div className="flex flex-col w-64 p-1 border-r">
        <div className="flex flex-row gap-2 p-2 justify-between items-center">
          {/* <Input placeholder="Search..." /> */}
          <span
            className="font-light text-xl cursor-pointer hover:underline overflow-hidden text-ellipsis whitespace-nowrap"
            onClick={() => navigate({ to: basePath })}
          >{account ? account : authr.session?.handle }</span>
          <TreeMenu dialogRef={dialogRef} />
        </div>

        <FolderTree 
          onSelectChange={(item) => {
            // console.log("onSelect", item)
            // setCurrItem(item)
            navigate({ to: `${basePath}/${item.id}` })
            // if (item.nsid === APP_BLEBBIT_AUTHR_PAGE_RECORD_DOC.id) {
              // if it's a page, we want to navigate to the page view 
            // }
          }}
          dialogRef={dialogRef}
          account={account}
        />
      </div>
      <Outlet />

    </div>
  );
}



export default PagesLayout;
