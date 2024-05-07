import { Plus } from "lucide-react"
import { Combobox } from "~/components/combobox"
import { DatePicker } from "~/components/date-picker"
import { InputWithLabel } from "~/components/input-with-label"
import { TextAreaWithLabel } from "~/components/textarea-with-label"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { zodResolver } from '@hookform/resolvers/zod';
import { useFetcher } from "@remix-run/react"
import { useRemixForm } from "remix-hook-form"
import { useEffect, useState } from "react"
import { ActionResponse } from "~/types/action-response"
import { Transaction } from "~/types/cashflow/transaction"
import { toast } from "~/components/ui/use-toast"
import { normalizeMoney } from "~/masks"
import { CreateTransactionSchema, createTransactionSchema } from "../validation/create-transaction"

const transactionTypes = [
  { label: 'Receita', value: 'Invoice' },
  { label: 'Despesa', value: 'Expense' }
]
const transactionStatus = [
  { label: 'Pago', value: 'PAID' },
  { label: 'Não pago', value: 'UNPAID' }
]

export function CreateTransactionDialog() {
  const [open, setOpen] = useState(false);
  const fetcher = useFetcher<ActionResponse<Transaction>>();
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
    reset,
  } = useRemixForm<CreateTransactionSchema>({
    resolver: zodResolver(createTransactionSchema),
    fetcher,
    defaultValues: { value: '0' }
  });
  useEffect(() => {
    if (fetcher.state === 'loading' && fetcher.data?.ok) {
      toast({
        title: 'Sucesso',
        description: 'Transação cadastrada com sucesso.',
      });
      reset();
      setOpen(false);
    }
    if (fetcher.state === 'loading' && !fetcher.data?.ok) {
      toast({
        title: 'Erro',
        description: fetcher.data?.error,
        variant: 'destructive'
      });
    }
  }, [fetcher.state, fetcher.data]);
  const isSubmitting = fetcher.state === 'submitting';
  const handleCancel = () => {
    reset();
    setOpen(false);
  }
  //#region masks
  useEffect(() => {
    if(watch('value')) setValue('value', normalizeMoney(watch('value')));
  }, [watch('value')]);
  //#endregion
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          Criar transação
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <fetcher.Form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Criar transação</DialogTitle>
            <DialogDescription>
              Crie transações para ter um controle financeiro.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <InputWithLabel disabled={isSubmitting} label="Nome: *" {...register('name')} error={errors.name?.message} />
            <TextAreaWithLabel disabled={isSubmitting} label="Descrição: " {...register('description')} error={errors.description?.message}/>
            <Combobox 
              label="Tipo: *"
              buttonText="Tipo de transação"
              disabled={isSubmitting}
              initialData={transactionTypes} 
              value={transactionTypes.find(t => t.value === watch('type'))}
              onSelectValue={v => setValue('type', v.value.toString())}
              error={errors.type?.message}
            />
            <Combobox 
              label="Status: *" 
              buttonText="Status da transação"
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
            <Button loading={isSubmitting}>Criar</Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  )
}
