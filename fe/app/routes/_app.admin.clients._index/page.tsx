import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";
import { TableHeader, TableRow, TableHead, TableBody, Table, TableCell } from "~/components/ui/table";
import { useNavigate, useNavigation, useSearchParams } from "@remix-run/react";
import { LoaderData, loader } from "./loader";
import { Button } from "~/components/ui/button";
import { Plus, Search } from "lucide-react";
import { useCachedLoaderData } from "remix-client-cache";
import { formatDate } from "~/formats/date-format";
import { Input } from "~/components/ui/input";

const ClientsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const data: LoaderData = useCachedLoaderData<typeof loader>();
  const navigation = useNavigation();
  const loading = navigation.state === 'loading';
  
  return ( 
    <main className="flex flex-1 flex-col h-full p-4 md:p-8">
      <Card className="h-full flex-1">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="grid gap-2">
            <CardTitle>Clientes</CardTitle>
            <CardDescription>
              Lista de clientes do seu estabelecimento
            </CardDescription>
          </div>
          <div className="flex gap-4">
            <form className="relative" method="get">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                name="filter"
                placeholder="Filtrar..."
                defaultValue={searchParams.get('filter') ?? ''}
                className="w-full bg-background pl-8 md:w-[200px] lg:w-[336px]"
              />
            </form>
            <Button onClick={() => navigate('/admin/clients/create')}>
              <Plus className="h-4 w-4 mr-1" />
              Criar cliente
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/4 md:w-1/5">Nome</TableHead>
                <TableHead className="w-1/4 md:w-1/5">E-mail</TableHead>
                <TableHead className="w-1/4 md:w-1/5">Telefone</TableHead>
                <TableHead className="hidden md:table-cell w-full">Ultimo agendamento</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {
              !loading && data?.clients?.map(client => (
                <TableRow key={client.id}>
                  <TableCell>
                    <p className="font-bold">{client.name}</p>
                    { 
                      client.alias && 
                      <p className="text-muted-foreground">{client.alias}</p>
                    }
                  </TableCell>
                  <TableCell>
                    {client.email ? client.email : '-'}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {client.phone ? client.phone : '-'}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                  {client.lastReserveDate ? formatDate(client.lastReserveDate) : 'Sem agendamentos'}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-end">
                    <Button size="sm" onClick={() => navigate(`/admin/clients/update/${client.id}`)}>
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            }
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
 
export default ClientsPage;