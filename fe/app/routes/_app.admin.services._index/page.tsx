import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";
import { TableHeader, TableRow, TableHead, TableBody, Table, TableCell } from "~/components/ui/table";
import { useNavigate, useNavigation } from "@remix-run/react";
import { LoaderData, loader } from "./loader";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { useCachedLoaderData } from "remix-client-cache";

const ServicesPage = () => {
  const navigate = useNavigate();
  const data: LoaderData = useCachedLoaderData<typeof loader>();
  const navigation = useNavigation();
  const loading = navigation.state === 'loading';
  
  return ( 
    <main className="flex flex-1 flex-col h-full p-4 md:p-8">
      <Card className="h-full flex-1">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="grid gap-2">
            <CardTitle>Serviços</CardTitle>
            <CardDescription>
              Todos seus serviços são cadastrados aqui.
            </CardDescription>
          </div>
          <Button size="sm" onClick={() => navigate('/admin/services/create')}>
            <Plus className="h-4 w-4 mr-1" />
            Criar serviço
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3 md:w-1/5">Nome</TableHead>
                <TableHead className="w-1/3 md:w-1/5">Descrição</TableHead>
                <TableHead className="hidden md:table-cell w-1/5">Agend. Cliente</TableHead>
                <TableHead className="hidden md:table-cell w-full">Variações</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {
              !loading && data?.services?.map(t => (
                <TableRow 
                  key={t.id} 
                >
                  <TableCell>
                    <p className="font-bold">{t.name}</p>
                    <p className="text-muted-foreground">{t.identifier ? t.identifier : '-'}</p>
                  </TableCell>
                  <TableCell>
                    {`${t.description?.slice(0, 50)}${t.description && t.description.length > 50 ? '...' : ''}`}

                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {t.allowClientReserve ? 'Sim' : 'Não'}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {t.variants && t.variants?.length > 0 ? `${t.variants.length} variações` : 'Sem variações'}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-end">
                    <Button size="sm" variant="link" onClick={() => navigate(`/admin/services/update/${t.id}`)}>
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
 
export default ServicesPage;