import { AcctSearch } from "@/components/widgets/acct-search";

export const Sharing = ({
  addMember,
}: {
  addMember: ({ id, relation }: { id: string, relation: string }) => void
}) => {
  return (
    <div className="flex flex-row gap-4 my-12 justify-center">
      <AcctSearch
        addMember={addMember}
      />
    </div>
  )
}