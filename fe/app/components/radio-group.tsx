import { twMerge } from "tailwind-merge";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface Option {
  label: string;
  value: string;
}

interface RadioProps {
  options: Option[];
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  label?: string;
  id?: string;
}

const Radio = ({ options, value, onValueChange, className, label, id }: RadioProps) => {
  return (
    <div className={twMerge("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id}>{label}</Label>
      <RadioGroup id={id} className="flex" value={value} onValueChange={onValueChange}>
        {options.map(option => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem
              id={`${id}-${option.value}`}
              value={option.value}
            />
            <Label htmlFor={`${id}-${option.value}`}>{option.label}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default Radio;
