import { Badge } from "~/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "~/components/ui/table";
import { CreateTransactionDialog } from "./create-transaction-dialog";
import { useLoaderData, useNavigate, useNavigation } from "@remix-run/react";
import { loader } from "../loader";
import { TransactionStatus } from "~/types/cashflow/transaction";
import { formatDate } from "~/formats/date-format";
import { formatMoney } from "~/formats/money-format";
import { formatStatus, formatType } from "~/formats/transaction-format";
import { twMerge } from "tailwind-merge";
import { GetCashflow } from "~/types/cashflow/cashflow";
import Spinner from "~/components/spinner";
import { useState } from "react";
import { UpdateTransactionDialog } from "./update-transaction-dialog";
import moment from "moment";

const TransactionCard = () => {
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<string>();
  const data: GetCashflow = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const loading = navigation.state === 'loading';
  const handleEdit = (id: string) => {
    setSelectedTransaction(id);
    setUpdateModalOpen(true);
  }
  return ( 
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Transações</CardTitle>
          <CardDescription>
            Transações da sua clinica
          </CardDescription>
        </div>
        <div className="ml-auto gap-1">
          <CreateTransactionDialog />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="hidden md:table-cell">Data</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              !loading && data?.transactions?.map(t => (
                <TableRow
                  key={t.id} 
                  onClick={() => handleEdit(t.id)}
                  className="cursor-pointer"
                >
                  <TableCell className="font-bold">{t.name}</TableCell>
                  <TableCell>{formatType(t.type)}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge 
                      className={twMerge("text-xs transition", t.status === TransactionStatus.PAID ? 'bg-green-400' : 'bg-yellow-400' )} 
                    >
                    {formatStatus(t.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {moment(t.date).format('DD/MM/YYYY')}
                  </TableCell>
                  <TableCell 
                    className={twMerge("text-right", t.type === "Invoice" ? 'text-green-400' : 'text-red-400')}
                  >{`${t.type === "Expense" ? '- ' : '' }${formatMoney(t.value)}`}</TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
        { loading && <TableLoading /> }
      </CardContent>
      <UpdateTransactionDialog 
        open={updateModalOpen} 
        setOpen={setUpdateModalOpen} 
        resetTransactionId={() => setSelectedTransaction(undefined)}
        transactionId={selectedTransaction}
      />
    </Card>
  );
}
const TableLoading = () => {
  return (
    <div className="flex flex-col text-2xl font-medium gap-6 p-4 items-center">
      <h1>Carregando...</h1>
      <Spinner variant="outline" size="lg" />
    </div>
  )
}
export default TransactionCard;