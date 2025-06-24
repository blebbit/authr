import { AcctSearch } from "@/components/widgets/acct-search";

export const Sharing = ({
  addMember,
}: {
  addMember?: (subject: string) => void;
}) => {
  return (
    <div className="flex flex-row gap-4 my-12 justify-center">
      <AcctSearch
        addMember={(subject: string) => {
          console.log("Adding member with subject:", subject);
        }}
      />
    </div>
  )
}