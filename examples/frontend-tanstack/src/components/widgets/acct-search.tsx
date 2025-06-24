import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuthr } from "@blebbit/authr-react-tanstack";

import { AutoComplete } from "./auto-complete";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

export const AcctSearch = ({
  addMember,
}: {
  addMember?: any;
}) => {
  const authr = useAuthr();
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<string>("");

  // TODO, two queries, one for users, one for groups
  const { data, isLoading } = useQuery({
    queryKey: ["userSearch", searchValue],
    queryFn: async (searchValue) => {
      console.log("autocomplete searchValue", searchValue);
      var [_, value = ""] = searchValue.queryKey;
      if (!value || value.trim() === "") {
        return
      }
      if (value.startsWith("@")) {
        value = value.slice(1); // Remove leading '@' if present
      }
      const r = await fetch(`https://public.api.bsky.app/xrpc/app.bsky.actor.searchActorsTypeahead?q=${value}&limit=8`)
      const data: any = await r.json()
      // console.log("autocomplete response", data)
      return data?.actors?.map((item: any) => ({
        value: item.did,
        label: item.handle || item.did,
        displayName: item.displayName || item.handle || item.did,
        avatar: item.avatar
      }));
    },
    enabled: !!searchValue && searchValue.trim() !== "",
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      if (!selectedValue) {
        console.warn("No user selected to add.");
        return;
      }
      console.log("Adding user:", selectedValue);
      if (addMember) {
        const ret = await addMember(selectedValue);
      } else {
        console.warn("No addMember function provided.");
      }
    }
  })

  // console.log("UserSearch.data", isLoading, data);

  // sort groups before users, probably need a way to display what account the group is associated with

  const disabled = !selectedValue || isLoading;

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          disabled ? "" : "hover:bg-primary hover:text-primary-foreground",
        )}
        disabled={disabled}
        onClick={() => addMutation.mutate()}
      >
        Add
      </Button>

      <AutoComplete
        selectedValue={selectedValue}
        onSelectedValueChange={setSelectedValue}
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
        items={data || []}
        // Optional props
        isLoading={isLoading}
        disabled={!authr?.session}
        emptyMessage="No accounts found."
        placeholder="@handle, @group, or DID"
      />
    </>
  );

}