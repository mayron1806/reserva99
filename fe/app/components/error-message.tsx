import React from "react";

const ErrorMessage = ({ children }: { children: React.ReactNode }) => {
  return ( 
    <p className="text-destructive text-xs h-3">{children}</p>
  );
}
 
export default ErrorMessage;