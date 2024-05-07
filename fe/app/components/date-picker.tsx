import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ptBR } from "date-fns/locale";
import moment from "moment";
import ErrorMessage from "./error-message";
import { Label } from "./ui/label";

type Props = {
  date?: Date | string,
  setDate: (date?: Date) => void;
  error?: string;
  label?: string;
  disabled?: boolean;
}
export function DatePicker({ setDate, date, error, label, disabled }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild disabled={disabled}>
        <div className="w-full flex flex-col gap-1.5">
          {
            label &&
            <Label>{label}</Label>
          }
          <Button
            type="button"
            disabled={disabled}
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
          </Button>
          {
            error && <ErrorMessage>{error}</ErrorMessage>
          }

        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          locale={ptBR}
          selected={moment(date).toDate()}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
