import { useLoaderData, useNavigate, useSearchParams } from "@remix-run/react";
import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import BigCalendar from "~/components/big-calendar";
import { LoaderData, loader } from "./loader";
import moment from "moment";
import { useState } from "react";
import ShowReserveDialog from "./components/show-reserve-dialog";

const SchedulePage = () => {
  const [openViewReserve, setOpenViewReserve] = useState(false);
  const [reserveId, setReserveId] = useState<string>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const data: LoaderData = useLoaderData<typeof loader>();

  const searchParamsDate = searchParams.get("date");
  const date = moment(searchParamsDate ?? moment()).toDate();
  const onSelectReserve = (id: string) => {
    setReserveId(id);
    setOpenViewReserve(true);
  }
  return ( 
    <main className="flex flex-1 flex-col h-full p-4 md:p-8">
      <Card className="h-full flex-1">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="grid gap-2">
            <CardTitle>Agendamentos</CardTitle>
          </div>
          <Button size="sm" onClick={() => navigate('/admin/schedule/create')}>
            <Plus className="h-4 w-4 mr-1" />
            Criar agendamento
          </Button>
        </CardHeader>
        <CardContent>
          <BigCalendar 
            reserves={data.reserves} 
            defaultDate={date} 
            weekTime={data.time}
            onSelectReserve={onSelectReserve}
          />
        </CardContent>
      </Card>
      <ShowReserveDialog 
        open={openViewReserve}
        setOpen={setOpenViewReserve}
        reserveId={reserveId}
      />
    </main>
  );
}
 
export default SchedulePage;
/**
 * listar agendamentos
  criar agendamento
  deletar / cancelar agendamento
  atualizar agendamento
 */