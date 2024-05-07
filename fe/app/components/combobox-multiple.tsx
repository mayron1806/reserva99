import * as React from "react"
import { Check, ChevronsUpDown, PlusIcon } from "lucide-react"

import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { Label } from "./ui/label"
import { useState } from "react"

export type Option = {
  label: string;
  value: string;
}
type Props = {
  value?: Option[],
  onSelectValue?: (data: Option) => void;
  initialData?: Option[];
  label?: string;
  buttonText?: string;
  newItemButtonText?: string;
  inputPlaceholder?: string;
}
export function ComboboxMultiple({ onSelectValue, value, label, buttonText, initialData, newItemButtonText, inputPlaceholder }: Props) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const addNew = (newItem: string) => {
    onSelectValue?.({ label: newItem, value: newItem });
    setOpen(false);
    setInputValue('');
  }
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div>
          <Label>{label}</Label>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
              {buttonText}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
          <div className="flex gap-2 mt-2">
            {value?.map(v => (
              <p key={v.value} className="p-3 py-[2px] rounded-full bg-gray-300 text-sm">{v.label}</p>
            ))}
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={inputPlaceholder} value={inputValue} onValueChange={setInputValue} />
          <CommandEmpty>
            <Button
              variant="outline"
              role="button"
              onClick={() => addNew(inputValue)}
              aria-expanded={open}
              className="w-full justify-between"
            >
              {newItemButtonText} com nome "{inputValue}"
              <PlusIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </CommandEmpty>
          <CommandList>
            <CommandGroup>
              {initialData?.map((data) => (
                <CommandItem
                  key={data.value}
                  value={data.value}
                  onSelect={(currentValue) => {
                    onSelectValue?.(data);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value?.find(v => v.value === data.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {data.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          {
            inputValue.length > 2 &&
            <CommandItem asChild>
              <Button
                variant="outline"
                role="button"
                aria-expanded={open}
                onClick={() => addNew(inputValue)}
                className="w-full justify-between"
              >
                {newItemButtonText} com nome "{inputValue}"
                <PlusIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </CommandItem>
          }
        </Command>
      </PopoverContent>
    </Popover>
  )
}
