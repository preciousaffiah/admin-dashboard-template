"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const ComboboxDemo = ({ setValue, selectValue, itemsArray }: any) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValueLocal] = React.useState("");
let prevValue = ""
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between  border-0"
        >
          {value
            ? itemsArray.find((item: string) => item === value)
            : "Select table..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0  border-0">
        <Command className="bg-neutral-700">
          <CommandInput placeholder="Search table..." />
          <CommandList>
            <CommandEmpty>No table found.</CommandEmpty>
            <CommandGroup>
              {itemsArray.map((item: string) => (
                <CommandItem
                  key={prevValue}
                  value={item}
                  onSelect={(currentValue: any) => {
                    setValue(selectValue, item)
                    setValueLocal(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
export default ComboboxDemo;