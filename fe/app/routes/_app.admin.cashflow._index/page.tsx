import { DollarSign } from "lucide-react";

import SimpleCard from "./components/simple-card";
import TransactionCard from "./components/transaction-card";
import Filters from "./components/filters";
import { GetCashflow } from "~/types/cashflow/cashflow";
import { useLoaderData, useNavigation, useSearchParams } from "@remix-run/react";
import { loader } from "./loader";
import { formatMoney } from "~/formats/money-format";
import moment from "moment";
const filterParam = (data: string | null) => {
  return moment(data, 'YYYY-MM-DD').format('DD/MM/YYYY');
}
const CashFlowPage = () => {
  const transition = useNavigation();
  const loading = transition.state === 'loading';
  const [searchParams] = useSearchParams();
  const data: GetCashflow = useLoaderData<typeof loader>();
  const start = filterParam(searchParams.get('start'));
  const end = filterParam(searchParams.get('end'));
  return ( 
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex flex-col gap-2">
        <Filters />
        <div className="flex justify-end gap-2 font-medium text-muted-foreground">
          <p>Início: {start}</p>
          <p>-</p>
          <p>Fim: {end}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3 md:gap-8">
          <SimpleCard 
            loading={loading}
            title="Saldo"
            Icon={DollarSign}
          >
            <div className="text-2xl font-bold">{formatMoney(data.balance)}</div>
          </SimpleCard>
          <SimpleCard 
            title="Receita"
            loading={loading}
            Icon={DollarSign}
          >
            <div className="text-2xl font-bold">{formatMoney(data.income)}</div>
          </SimpleCard>
          <SimpleCard 
            loading={loading}
            title="Despesas"
            Icon={DollarSign}
          >
            <div className="text-2xl font-bold">-{formatMoney(data.expense)}</div>
          </SimpleCard>
        </div>
      </div>
      <div className="grid">
        <TransactionCard />
      </div>
    </main>
  );
}
 
export default CashFlowPage;