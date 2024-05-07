import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

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
import ErrorMessage from "./error-message"

export type Option = {
  label: string;
  value: string | number;
}
type Props = {
  value?: Option,
  onSelectValue?: (data: Option) => void;
  initialData?: Option[];
  label?: string;
  buttonText?: string;
  emptyMessage?: string;
  inputPlaceholder?: string;
  error?: string;
  disabled?: boolean;
}
export function Combobox({ onSelectValue, value, label, buttonText, initialData, emptyMessage, inputPlaceholder, error, disabled }: Props) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="flex flex-col gap-1.5">
          <Label>{label}</Label>
          <Button
            disabled={disabled}
            variant="outline"
            role="combobox"
            type="button"
            aria-expanded={open}
            className="w-full justify-between"
          >
              {value 
                ? initialData?.find((data) => data.value === value.value)?.label
                : buttonText}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
          {
            error && <ErrorMessage>{error}</ErrorMessage>
          }
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={inputPlaceholder} />
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {initialData?.map((data) => (
                <CommandItem
                  key={data.value}
                  value={data.value.toString()}
                  onSelect={() => {
                    onSelectValue?.(data);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value?.value === data.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {data.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
