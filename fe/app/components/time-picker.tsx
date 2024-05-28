import ErrorMessage from "./error-message";
import { cn } from "~/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { useState } from "react";
import { Label } from "./ui/label";
import { Check } from "lucide-react";
type Props = {
  buttonText?: string;
  error?: string;
  className?: string;
  setValue?: (time: string) => void;
}
const hours = Array.from({length: 24}, (_, i) => i); // Gera um array de 0 a 23
const minutes = Array.from({length: 60}, (_, i) => i); // Gera um array de 0 a 59

const TimePicker = ({ className, error, buttonText }: Props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [h, setH] = useState('');
  const [m, setM] = useState('');
  const handleValue = () => {
    if (h.length == 2 && m.length === 2) {
      setValue(`${h}:${m}`);
      setOpen(false);
    }
    setValue('');
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className={cn("grid w-full items-center gap-1.5", className)}>
          <Label>Hora: *</Label>
          <div className="relative">
            <Button type="button" variant="outline" className=" w-full justify-start">
              {h.length === 2 || minutes.length === 2 ? `${h}:${m}` : buttonText}
            </Button>
          </div>
          {
            error && <ErrorMessage>{error}</ErrorMessage>
          }
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex gap-2">
          <Command>
            <CommandInput placeholder="Horas" />
            <CommandList>
              <CommandGroup>
                {hours.map((hour) => (
                <CommandItem
                  key={hour}
                  value={hour.toString()}
                  onSelect={(currentValue) => {
                    const v = currentValue.padStart(2, '0');
                    setH(v);
                    handleValue();
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      h === hour.toString().padStart(2, '0') ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {hour}
                </CommandItem>
              ))}
              </CommandGroup>
            </CommandList>
          </Command>
          <Command>
            <CommandInput placeholder="Minutos" />
            <CommandList>
              <CommandGroup>
                {minutes.map((minute) => (
                <CommandItem
                  key={minute}
                  value={minute.toString()}
                  onSelect={(currentValue) => {
                    const v = currentValue.padStart(2, '0');
                    setM(v);
                    handleValue();
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      m === minute.toString().padStart(2, '0') ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {minute}
                </CommandItem>
              ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </PopoverContent>
    </Popover>
  )
}
export { TimePicker };