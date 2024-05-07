import * as React from "react"
import { Label } from "~/components/ui/label"
import { Textarea } from "./ui/textarea";
import ErrorMessage from "./error-message";
import { twMerge } from "tailwind-merge";
import { cn } from "~/lib/utils";
 
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const TextAreaWithLabel = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, label, error, ...props }, ref) => {
  return (
    <div className={twMerge("grid w-full items-center gap-1.5", className)}>
      {
        label &&
        <Label htmlFor={props.id}>{label}</Label>
      }
      <Textarea
        ref={ref}
        {...props}
        className={cn(className)}
      />
      {
        error && <ErrorMessage>{error}</ErrorMessage>
      }
    </div>
  )
});
TextAreaWithLabel.displayName = "TextAreaWithLabel";
export { TextAreaWithLabel };