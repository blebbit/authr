import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuthr } from "@blebbit/authr-react-tanstack";

import { AutoComplete } from "./auto-complete";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

export const UserSearch = ({
  addMember,
}: {
  addMember?: (did: string) => void;
}) => {
  const authr = useAuthr();
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<string>("");

  const { data, isLoading } = useQuery({
    queryKey: ["userSearch", searchValue],
    queryFn: async (searchValue) => {
      console.log("autocomplete searchValue", searchValue);
      const [_, value = ""] = searchValue.queryKey;
      if (!value || value.trim() === "") {
        return
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

  const addUser = useMutation({
    mutationFn: async () => {
      if (!selectedValue) {
        console.warn("No user selected to add.");
        return;
      }
      console.log("Adding user:", selectedValue);
      if (addMember) {
        addMember(selectedValue);
      } else {
        console.warn("No addMember function provided.");
      }
    }
  })

  // console.log("UserSearch.data", isLoading, data);

  const disabled = !selectedValue || isLoading;

  return (
    <div className="flex flex-grow gap-2 justify-end">
      <Button
        variant="outline"
        className={cn(
          disabled ? "" : "hover:bg-primary hover:text-primary-foreground",
        )}
        disabled={disabled}
        onClick={() => addUser.mutate()}
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
        placeholder="Handle or DID"
      />
    </div>
  );

}