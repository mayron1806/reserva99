import * as React from "react"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import ErrorMessage from "./error-message";
import { cn } from "~/lib/utils";
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const InputWithLabel = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, label, error, ...props }, ref) => {
  return (
    <div className={cn("grid w-full items-center gap-1.5", className)}>
      {
        label &&
        <Label htmlFor={props.id}>{label}</Label>
      }
      <Input
        type={type}
        ref={ref}
        {...props}
      />
      <ErrorMessage>{error}</ErrorMessage>
    </div>
  )
});
InputWithLabel.displayName = "InputWithLabel";
export { InputWithLabel };