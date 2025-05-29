import { cn } from "@/lib/utils";
import { Command as CommandPrimitive } from "cmdk";
import { Check } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Input } from "../ui/input";
import { Popover, PopoverAnchor, PopoverContent } from "../ui/popover";
import { Skeleton } from "../ui/skeleton";

type Props<T extends string> = {
  selectedValue: T;
  onSelectedValueChange: (value: T) => void;
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  items: { value: T; label: string; handle: string; avatar: string }[];
  isLoading?: boolean;
  emptyMessage?: string;
  placeholder?: string;
  disabled?: boolean;
};

export function AutoComplete<T extends string>({
  selectedValue,
  onSelectedValueChange,
  searchValue,
  onSearchValueChange,
  items,
  isLoading,
  emptyMessage = "No accounts",
  placeholder = "Search...",
  disabled = false,
}: Props<T>) {

  const [open, setOpen] = useState(false);

  const labels = useMemo(
    () =>
      items.reduce((acc, item) => {
        acc[item.value] = item.label;
        return acc;
      }, {} as Record<string, string>),
    [items]
  );

  const reset = () => {
    onSelectedValueChange("" as T);
    onSearchValueChange("");
  };

  const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (
      !e.relatedTarget?.hasAttribute("cmdk-list") &&
      labels[selectedValue] !== searchValue
    ) {
      reset();
    }
  };

  const onSelectItem = (inputValue: string) => {
    if (inputValue === selectedValue) {
      reset();
    } else {
      onSelectedValueChange(inputValue as T);
      onSearchValueChange(labels[inputValue] ?? "");
    }
    setOpen(false);
  };

  var selectedAccount = items.find(
    (item) => item.value === selectedValue
  );

  return (
    <div className="flex items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false}>
          <PopoverAnchor asChild>
            <CommandPrimitive.Input
              asChild
              value={searchValue}
              onValueChange={onSearchValueChange}
              onKeyDown={(e) => setOpen(e.key !== "Escape")}
              onMouseDown={() => setOpen((open) => !!searchValue || !open)}
              onFocus={() => setOpen(true)}
              onBlur={onInputBlur}
              disabled={disabled}
              className="min-w-64"
            >
              { selectedAccount ? (
                  <div
                    className="flex items-center gap-2"
                    onClick={()=>{
                      setOpen(true);
                      onSelectedValueChange("" as T)
                    }}
                  >
                    <Avatar>
                      <AvatarImage src={selectedAccount.avatar} />
                      <AvatarFallback>{selectedAccount.label.substring(0,2)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">
                      {selectedAccount.label}
                    </span>
                  </div>
                ): <Input placeholder={placeholder}/>
              }
            </CommandPrimitive.Input>
          </PopoverAnchor>
          {!open && <CommandList aria-hidden="true" className="hidden" />}
          <PopoverContent
            asChild
            onOpenAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => {
              if (
                e.target instanceof Element &&
                e.target.hasAttribute("cmdk-input")
              ) {
                e.preventDefault();
              }
            }}
            className="w-[--radix-popover-trigger-width] p-0"
          >
            <CommandList>
              {isLoading && (
                <CommandPrimitive.Loading>
                  <div className="p-1">
                    <Skeleton className="h-6 w-full" />
                  </div>
                </CommandPrimitive.Loading>
              )}
              {items.length > 0 && !isLoading ? (
                <CommandGroup>
                  {items.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onMouseDown={(e) => e.preventDefault()}
                      onSelect={onSelectItem}
                    >
                      <Avatar>
                        <AvatarImage src={option.avatar} />
                        <AvatarFallback>{option.label.substring(0,2)}</AvatarFallback>
                      </Avatar>
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}
              {!isLoading ? (
                <CommandEmpty>
                  <span className="px-4">{emptyMessage ?? "No items."}</span>
                </CommandEmpty>
              ) : null}
            </CommandList>
          </PopoverContent>
        </Command>
      </Popover>
    </div>
  );
}