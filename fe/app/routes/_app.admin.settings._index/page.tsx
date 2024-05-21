import { useLoaderData } from "@remix-run/react";
import { LoaderData } from "./loader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";
import EditCompanyDialog from "./components/edit-company-dialog";

const GeneralPage = () => {
  const data: LoaderData = useLoaderData();
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Informações gerais</CardTitle>
          <CardDescription>Informações gerais</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex gap-4">
            <Avatar className="w-20 h-20 lg:w-40 lg:h-40">
              <AvatarFallback>{data.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-bold">{data.name}</h3>
              <p>{data.identifier}</p>
              <p>{data.description}</p>
            </div>
          </div>
          <Separator orientation="horizontal" />
          <div>
            <CardTitle>Endereço</CardTitle>
            <CardDescription>Endereço físico (para consultas locais)</CardDescription>
            <div className="mt-2">
              <p><strong>País: </strong> {data.address?.country}</p>
              <p><strong>Estado: </strong> {data.address?.state}</p>
              <p><strong>Cidade: </strong> {data.address?.city}</p>
              <p><strong>Bairro: </strong> {data.address?.district}</p>
              <p><strong>Rua: </strong> {data.address?.street}</p>
              <p><strong>Número: </strong> {data.address?.number}</p>
              <p><strong>Complemento: </strong> {data.address?.complement}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <EditCompanyDialog />
    </>
  );
}
 
export default GeneralPage;