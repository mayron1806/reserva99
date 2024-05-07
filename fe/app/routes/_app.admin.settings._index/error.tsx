import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { CircleX } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

const ErrorBoundary = () => {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <Card className="text-center">
        <CardHeader>
          <CardTitle>{error.status}</CardTitle>
          <CardDescription>{error.data}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <CircleX className="w-20 h-20 text-destructive"/>
        </CardContent>
      </Card>
    )
  }
}
 
export default ErrorBoundary;