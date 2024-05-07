import { format, subYears, subMonths, subWeeks, subDays } from "date-fns";
import { Filter } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ptBR } from 'date-fns/locale';
import { useNavigate } from "@remix-run/react";

const Filters = () => {
  const navigate = useNavigate();
  const [range, setRange] = useState<DateRange | undefined>();
  const handleFilter = (range: DateRange) => {
    const start = range.from;
    const end = range.to;
    if (!start || !end) {
      console.warn('Sem data de inicio ou fim.')
      return;
    }
    const query = `?start=${format(start, 'yyyy-MM-dd')}&end=${format(end, 'yyyy-MM-dd')}`;
    console.log(query);
    
    navigate({
      pathname: '.',
      search: query,
    });
  }
  const handleTabFilter = (value: string) => {
    const currentDate = new Date();
    let tabRange: DateRange = { from: currentDate, to: currentDate };
    switch (value) {
      case 'year':
        tabRange.from = subYears(currentDate, 1);
        break;
      case 'month':
        tabRange.from = subMonths(currentDate, 1);
        break;
      case 'two-weeks':
        tabRange.from = subDays(currentDate, 15);
        break;
      case 'week':
      default:
        tabRange.from = subWeeks(currentDate, 1);
        break;
    }
    handleFilter(tabRange);
  }
  return ( 
    <Tabs onValueChange={e => handleTabFilter(e)}>
      <div className="flex justify-between flex-col sm:flex-row  gap-4">
        <TabsList>
          <TabsTrigger value="month">Ultimo mês</TabsTrigger>
          <TabsTrigger value="two-weeks">Ultimos 15 dias</TabsTrigger>
          <TabsTrigger value="week">Ultima semana</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button size="sm" className="h-8 gap-1">
              <Filter className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Filtro personalizado
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar
              mode="range"
              selected={range}
              locale={ptBR}
              onSelect={setRange}
              footer={<CalendarSelectFooter range={range} setRange={setRange} handleFilter={handleFilter} />}
            />
          </PopoverContent>
        </Popover>
        </div>
      </div>
    </Tabs>
  );
}
type CalendarSelectFooterProps = {
  range?: DateRange;
  setRange: (range?: DateRange) => void;
  handleFilter: (range: DateRange) => void;
}
const CalendarSelectFooter = ({ range, setRange, handleFilter }: CalendarSelectFooterProps) => {
  let footer = <p>Por favor, selecione o dia de início.</p>
  if (range?.from) {
    if (!range.to) {
      footer = <p>{format(range.from, 'PPP', { locale: ptBR })}</p>;
    } else if (range.to) {
      footer = (
        <p>
          {format(range.from, 'PPP', { locale: ptBR })} – {format(range.to, 'PPP', { locale: ptBR })}
        </p>
      );
    }
  }
  return (
    <div className="flex flex-col gap gap-2 pt-4">
      {footer}
        {
          !!range?.to &&
          <div className="flex justify-between">
            <Button type="button" onClick={() => setRange(undefined)} variant="outline">Limpar</Button>
            <Button onClick={() => handleFilter(range)}>Aplicar</Button>
          </div>
        }
    </div>
  );
}
 /**
  * filtros pre definido (ultimos 30 dias, ultima semana, ultimo ano)
  * data de inicio
  * data de fim
  */
export default Filters;