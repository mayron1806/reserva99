import ErrorMessage from "~/components/error-message";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { duration } from "~/constants/duration";
type DurationSelectProps = {
  value?: number;
  onSelectValue?: (v: string) => void;
  error?: string;
}
const DurationSelect = ({ onSelectValue, value, error }: DurationSelectProps) => {
  return (
    <div className="grid w-full items-center gap-1.5">
      <Label>Duração: *</Label>
      <Select value={value?.toString()} onValueChange={onSelectValue}>
        <SelectTrigger>
          <SelectValue placeholder="Duração" />
        </SelectTrigger>
        <SelectContent>
          {
            duration.map(d => (
              <SelectItem key={d.value} value={d.value.toString()}>{d.label}</SelectItem>
            ))
          }
        </SelectContent>
      </Select>
      <ErrorMessage>{error}</ErrorMessage>
    </div>
  )
}
export { DurationSelect }