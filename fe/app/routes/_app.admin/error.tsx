import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { CircleX } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

const ErrorBoundary = () => {
  const error = useRouteError();
  const handleGoToSelect = () => {
    const currentURL = new URL(window.location.href);
    let domain = currentURL.hostname;
    if(currentURL.port.length > 0) domain += `:${currentURL.port}`;
    const url = `${currentURL.protocol}//${domain}/hub`;
    window.location.href = url;
  }
  if (isRouteErrorResponse(error)) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Card className="text-center ">
          <CardHeader>
            <CardTitle>{error.status}</CardTitle>
            <CardDescription>{error.data}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center flex-col items-center gap-4">
            <CircleX className="w-20 h-20 text-destructive"/>
            <Button variant="outline" onClick={handleGoToSelect}>Voltar a seleção</Button>
          </CardContent>
        </Card>
      </div>
    )
  } else if (error instanceof Error) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Card className="text-center ">
          <CardHeader>
            <CardTitle>Erro</CardTitle>
            <CardDescription>{error.message}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center flex-col items-center gap-4">
            <CircleX className="w-20 h-20 text-destructive"/>
            <Button variant="outline" onClick={handleGoToSelect}>Voltar a seleção</Button>
          </CardContent>
        </Card>
      </div>
    );
  } else {
    <div className="w-full h-screen flex justify-center items-center">
      <Card className="text-center ">
        <CardHeader>
          <CardTitle>Erro</CardTitle>
          <CardDescription>Erro desconhecido</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center flex-col items-center gap-4">
          <CircleX className="w-20 h-20 text-destructive"/>
          <Button variant="outline" onClick={handleGoToSelect}>Voltar a seleção</Button>
        </CardContent>
      </Card>
    </div>
  }
}
 
export default ErrorBoundary;