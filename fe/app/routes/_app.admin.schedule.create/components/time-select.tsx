import { CheckCircle2 } from "lucide-react";
import moment from "moment";
import React from "react";
import { cn } from "~/lib/utils";

export const TimeSelect = ({ children }: { children: React.ReactNode}) => {
  return ( 
    <div className="grid xs:grid-cols-4 md:grid-cols-8 gap-2">
      {children}
    </div>
  );
}
type TimeSelectItemProps = {
  value: string;
  setSelected: (v: string) => void;
  selectedItem?: string;
  disabled?: boolean;
}
export const TimeSelectItem = ({ setSelected, value, selectedItem, disabled}: TimeSelectItemProps) => {
  return (
    <div
      aria-disabled={disabled}
      onClick={() => !disabled  && setSelected(value)}
      className={cn(
        "flex gap-2 justify-center w-full bg-primary text-primary-foreground p-2 rounded-lg cursor-pointer",
        disabled && ' cursor-not-allowed bg-muted text-muted-foreground'
      )} 
    >
      { selectedItem === value && <CheckCircle2 /> }
      {moment(value).format('HH:mm')}
    </div>
  );
 }
  