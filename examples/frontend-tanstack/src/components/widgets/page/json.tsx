import { 
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion"

export const PageJson = ({ page }) => (
  <Accordion
    type="single"
    collapsible
    className="w-full"
    defaultValue="none"
  >
    <AccordionItem value="json-values">
      <AccordionTrigger>JSON values</AccordionTrigger>
      <AccordionContent className="flex flex-col gap-4 [&>pre]:border [&>pre]:p-2 [&>pre]:bg-muted [&>pre]:rounded">
        <pre>page: {JSON.stringify(page, null, 2)}</pre>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);