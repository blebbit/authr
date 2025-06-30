import { 
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion"

export const FolderJson = ({ folder, items }) => (
  <Accordion
    type="single"
    collapsible
    className="w-full"
    defaultValue="none"
  >
    <AccordionItem value="json-values">
      <AccordionTrigger>JSON values</AccordionTrigger>
      <AccordionContent className="flex flex-col gap-4 [&>pre]:border [&>pre]:p-2 [&>pre]:bg-muted [&>pre]:rounded">
        <pre>folder: {JSON.stringify(folder, null, 2)}</pre>
        <pre>children: {JSON.stringify(items, null, 2)}</pre>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);