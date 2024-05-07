import { Combobox } from "~/components/combobox"
import { DatePicker } from "~/components/date-picker"
import { InputWithLabel } from "~/components/input-with-label"
import { TextAreaWithLabel } from "~/components/textarea-with-label"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { zodResolver } from '@hookform/resolvers/zod';
import { useFetcher, useLoaderData } from "@remix-run/react"
import { UpdateTransactionSchema, updateTransactionSchema } from "../validation/update-transaction"
import { useRemixForm } from "remix-hook-form"
import { useEffect, useState } from "react"
import { ActionResponse } from "~/types/action-response"
import { Transaction } from "~/types/cashflow/transaction"
import { toast } from "~/components/ui/use-toast"
import { normalizeMoney } from "~/masks"
import { useActionCallback } from "~/hooks/use-action-callback"
import { loader } from "../loader"
import { GetCashflow } from "~/types/cashflow/cashflow"
import DeleteTransactionDialog from "./delete-transaction-dialog"

const transactionTypes = [
  { label: 'Receita', value: 'Invoice' },
  { label: 'Despesa', value: 'Expense' }
]
const transactionStatus = [
  { label: 'Pago', value: 'PAID' },
  { label: 'Não pago', value: 'UNPAID' }
]
type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  transactionId?: string;
  resetTransactionId: () => void;
}
export function UpdateTransactionDialog({ open, setOpen, transactionId, resetTransactionId } : Props) {
  const [deleteTransactionOpen, setDeleteTransactionOpen] = useState(false);
  const data: GetCashflow = useLoaderData<typeof loader>();
  const fetcher = useFetcher<ActionResponse<Transaction>>();
  const isSubmitting = fetcher.state === 'submitting';

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
    reset,
  } = useRemixForm<UpdateTransactionSchema>({
    resolver: zodResolver(updateTransactionSchema),
    fetcher,
    defaultValues: { value: '0' },
    submitConfig: { method: 'PATCH' }
  });
  useActionCallback(fetcher, {
    onSuccess() {
      toast({
        title: 'Sucesso',
        description: 'Transação atualizada com sucesso.',
      });
      reset();
      setOpen(false);
      resetTransactionId();
    },
    onError(errorMessage) {
      toast({
        title: 'Erro',
        description: errorMessage ?? 'Ocorreu um erro ao atualizar a transação',
        variant: 'destructive'
      });
    },
  });
  
  const handleCancel = () => {
    reset();
    setOpen(false);
  }
  //#region masks
  useEffect(() => {
    if(watch('value')) setValue('value', normalizeMoney(watch('value')));
  }, [watch('value')]);
  //#endregion
 
  useEffect(() => {
    if(!transactionId) return;
    const selectedTransaction = data.transactions.find(t => t.id === transactionId);
    
    if (!selectedTransaction) {
      toast({
        title: 'Erro',
        description: 'Essa transação não existe.',
        variant: 'destructive',
      });
      reset();
      setOpen(false);
      return;
    }
    setValue("id", selectedTransaction.id);
    setValue("name", selectedTransaction.name);
    setValue("description", selectedTransaction.description);
    setValue("value", normalizeMoney(selectedTransaction.value.toString()));
    setValue("date", selectedTransaction.date.toString());
    setValue("status", selectedTransaction.status);
    setValue("type", selectedTransaction.type);
  }, [transactionId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <fetcher.Form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar transação</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <input type="hidden" {...register('id')} />
            <InputWithLabel disabled={isSubmitting} label="Nome: *" {...register('name')} error={errors.name?.message} />
            <TextAreaWithLabel disabled={isSubmitting} label="Descrição: *" {...register('description')} error={errors.description?.message}/>
            <Combobox 
              label="Tipo: *" 
              disabled={isSubmitting}
              initialData={transactionTypes} 
              value={transactionTypes.find(t => t.value === watch('type'))}
              onSelectValue={v => setValue('type', v.value.toString())}
              error={errors.type?.message}
            />
            <Combobox 
              label="Status: *" 
              disabled={isSubmitting}
              initialData={transactionStatus} 
              value={transactionStatus.find(t => t.value === watch('status'))}
              onSelectValue={v => setValue('status', v.value.toString())}
              error={errors.status?.message}
            />
            <InputWithLabel disabled={isSubmitting} label="Valor: *" {...register('value')} error={errors.value?.message} />
            <DatePicker 
              disabled={isSubmitting}
              label="Data da transação: *" 
              date={watch('date')} 
              setDate={date => date && setValue('date', date.toISOString())} 
              error={errors.date?.message} 
            />
          </div>
          <DialogFooter className="gap-2">
            <Button disabled={isSubmitting} type="button" variant="outline" onClick={handleCancel}>Cancelar</Button>
            <DeleteTransactionDialog 
              open={deleteTransactionOpen} 
              setOpen={setDeleteTransactionOpen} 
              closeTransactionDialog={() => {
                setOpen(false);
                resetTransactionId();
              }}
              transactionId={transactionId}
            />
            <Button loading={isSubmitting}>Salvar</Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  )
}
