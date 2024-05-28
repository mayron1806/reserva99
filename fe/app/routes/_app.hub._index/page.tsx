import { Form, useLoaderData } from "@remix-run/react";
import { LoaderData, loader } from "./loader";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { useEffect } from "react";
import { toast } from "~/components/ui/use-toast";
import { CompanyList } from "~/types/company";
import { CircleX, NavigationOffIcon } from "lucide-react";
import CreateCompanyDialog from "./components/create-company-dialog";
const handleNavigate = (subdomain: string) => {
  const currentURL = new URL(window.location.href);
  let domain = currentURL.hostname.includes(subdomain) ? currentURL.hostname.slice(subdomain.length, currentURL.hostname.length) : currentURL.hostname;
  if (currentURL.port.length > 0) {
    domain += `:${currentURL.port}`;
  }
  window.location.href =`${currentURL.protocol}//${subdomain}.${domain}/admin/schedule`;
}
const CompanyPage = () => {
  const data: LoaderData = useLoaderData<typeof loader>();
  useEffect(() => {
    if (!data.ok) {
      toast({
        title: 'Erro',
        description: data.errorMessage,
        variant: 'destructive',
      });
    }
  }, [data]);
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>
            Hub de seleção 
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <ScrollArea className="w-full">
            { data.ok && data.companies && data.companies.length > 0 && <CompanyTable data={data.companies} /> }
            { data.ok && data.companies && data.companies.length === 0 && <NoCompanyData /> }
            { !data.ok && <ErrorCompanyData /> }
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
const CompanyTable = ({ data }: {data: CompanyList}) => {
  return (
    <Form method="post" className="min-w-80">
      <Table className="min-w-96">
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Identificador</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            data.map(company => (
              <TableRow className="cursor-pointer" key={company.id} onClick={() => handleNavigate(company.identifier)}>
                <TableCell className="font-medium">{company.name}</TableCell>
                <TableCell>{company.identifier}</TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </Form>

  );
}
const NoCompanyData = () =>  {
  return (
    <div className=" h-full justify-center text-center items-center flex flex-col gap-6 max-w-[400px]">
      <h1 className="text-3xl font-bold">Nenhuma companhia</h1>
      <NavigationOffIcon className="w-20 h-20 text-secondary"/>
      <p className="text-muted-foreground">Você não está cadastrado em nenhuma companhia, mas não se preocupe, você pode criar a sua clicando no botão abaixo.</p>
      <CreateCompanyDialog handleNavigate={handleNavigate} />
    </div>
  );
}
const ErrorCompanyData = () =>  {
  return (
    <div className=" h-full justify-center text-center items-center flex flex-col gap-6 max-w-[400px]">
      <h1 className="text-3xl font-bold">Erro ao buscar companhias</h1>
      <CircleX className="w-20 h-20 text-secondary"/>
      <p className="text-muted-foreground">Ocorreu um erro ao buscar as companhias, tente novamente mais tarde.</p>
    </div>
  );
}
export default CompanyPage;