import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuthr } from "@blebbit/authr-react-tanstack";

import {
  appBlebbitAuthrGroupTypeAheadGroups
} from "authr-example-flexicon/client-ts"

import { AutoComplete } from "./auto-complete";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

export const AcctSearch = ({
  addMember,
}: {
  addMember: ({ id, relation }: { id: string, relation: string }) => void
}) => {
  const authr = useAuthr();
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<string>("");

  // TODO, two queries, one for users, one for groups
  const { data, isLoading } = useQuery({
    queryKey: ["groupSearch", searchValue],
    queryFn: async (searchValue) => {
      // console.log("autocomplete searchValue", searchValue);
      var [_, value = ""] = searchValue.queryKey;
      if (!value || value.trim() === "") {
        return undefined
      }

      // console.log("autocomplete value", value);

      // group search
      if (value.startsWith("@@")) { 
        const group = value.substring(2); // Remove leading '@@' if present
        if (group.length < 3) {
          return undefined; // Return empty if group name is too short
        }
        // console.log("autocomplete group search", group);

        var r: any; 
        try {
          r = await appBlebbitAuthrGroupTypeAheadGroups({
            prefix: group, // Remove leading '@@' if present
            limit: "8",
            account: authr?.session?.did,
          });
          // console.log("autocomplete group response", r);
        } catch (error) {
          console.error("Error fetching group typeahead:", error);
          return undefined;
        }


        const data: any = r
        // console.log("autocomplete group data", data)
        return data?.groups?.map((item: any) => {
          const value = JSON.parse(item.value);
          // console.log("autocomplete group item", item, value);
          return ({
            value: item.id,
            label: value.name ? "@@" + value.name : "@" + item.id,
            displayName: value.displayName || value.name || item.id,
          })
        });
      } else {
        // acct search
        var acct = value
        if (acct.startsWith("@")) {
          acct = acct.substring(1); // Remove leading '@' if present
        }
        // console.log("autocomplete acct search", acct);

        if (acct.length < 3) {
          return undefined; // Return empty if handle is too short
        }
        const r = await fetch(`https://public.api.bsky.app/xrpc/app.bsky.actor.searchActorsTypeahead?q=${acct}&limit=8`)
        const data: any = await r.json()
        // console.log("autocomplete response", data)
        return data?.actors?.map((item: any) => ({
          value: item.did,
          label: item.handle ? "@" + item.handle : item.did,
          displayName: item.displayName || item.handle || item.did,
          avatar: item.avatar
        }));

      }

    },
    enabled: !!searchValue,
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      if (!selectedValue) {
        console.warn("No user or group selected to add.");
        return;
      }
      console.log("Adding user:", selectedValue);
      if (addMember) {
        const ret = await addMember({ id: selectedValue, relation: "reader" });
      } else {
        console.warn("No addMember function provided.");
      }
    }
  })

  // console.log("AcctSearch.data", isLoading, data);

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
        placeholder="@handle, @@group, or DID"
      />
    </>
  );

}