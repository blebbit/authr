import { StickyNote } from "lucide-react";
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from "@/lib/utils";

export const PageBody = ({
  page,
}:{
  page: any
}) => {
  return (
    <div className="flex flex-col gap-4 p-2">
      <div
        className={cn(
          "rounded bg-white prose",
          "[&>p>a]:text-blue-500 [&>p>a]:hover:text-brat-green [&>p>a]:no-underline",
        )}
      >
        <Markdown remarkPlugins={[remarkGfm]}>{page?.value?.content || "No content available."}</Markdown>
      </div>
    </div>
  );
}