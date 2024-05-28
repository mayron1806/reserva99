import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import { Edit } from "lucide-react";
import { InputWithLabel } from "~/components/input-with-label";
import { TextAreaWithLabel } from "~/components/textarea-with-label";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Separator } from "~/components/ui/separator";
import { EditCompanySchema, editCompanySchema } from "../validation/edit-company";
import { LoaderData, loader } from "../loader";
import { ActionResponse } from "~/types/action-response";
import { useEffect, useState } from "react";
import { toast } from "~/components/ui/use-toast";
import { useRemixForm } from "remix-hook-form";
import { useCep } from "~/hooks/use-cep";

const EditCompanyDialog = () => {
  const [open, setOpen] = useState(false);
  const data: LoaderData = useLoaderData<typeof loader>();
  const fetcher = useFetcher<ActionResponse<LoaderData>>();
  const { getCepData, isLoading: isLoadingCep } = useCep();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitSuccessful }
  } = useRemixForm<EditCompanySchema>({
    resolver: zodResolver(editCompanySchema),
    fetcher,
    submitConfig: {
      navigate: false,
    },
    defaultValues: {
      name: data.name,
      description: data.description,
      address: data.address ? {
        city: data.address.city,
        complement: data.address.complement,
        country: data.address.country,
        number: data.address.number,
        state: data.address.state,
        street: data.address.street,
        zipCode: data.address.zipCode
      } : undefined
    }
  });
  useEffect(() => {
    if (fetcher.state === 'loading' && fetcher.data?.ok) {
      toast({
        title: 'Sucesso',
        description: 'Dados atualizados com sucesso.',
      });
      setOpen(false);
    }
    if (fetcher.state === 'loading' && !fetcher.data?.ok) {
      toast({
        title: 'Erro',
        description: fetcher.data?.error,
        variant: 'destructive'
      });
    }
  }, [fetcher.state, fetcher.data])

  const cep = watch('address.zipCode');
  useEffect(() => {
    if (cep?.length === 9) {
      const getCep = async () => {
        const address = await getCepData(cep);
        if (address) {
          setValue('address.country', address.country);
          setValue('address.state', address.state);
          setValue('address.district', address.district);
          setValue('address.city', address.city);
          setValue('address.street', address.street);
        }
      }
      getCep();
    }
  }, [cep]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>
          <Edit className="w-4 h-4 mr-2"/>
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[500px]">
        <Form onSubmit={handleSubmit} unstable_viewTransition>
          <DialogHeader>
            <DialogTitle>Editar Informações</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <InputWithLabel label="Nome: *" {...register('name')} />
            <TextAreaWithLabel label="Descrição: " {...register('description')}/>
            <Separator />
            <InputWithLabel label="CEP:" {...register('address.zipCode')}/>
            <div className="grid grid-cols-2 gap-2">
              <InputWithLabel disabled={isLoadingCep} label="País:" {...register('address.country')} autoComplete="address-line1" />
              <InputWithLabel disabled={isLoadingCep} label="Estado:" {...register('address.state')} autoComplete="address-line2"/>
              <InputWithLabel disabled={isLoadingCep} label="Cidade:" {...register('address.city')} autoComplete="address-line3"/>
              <InputWithLabel disabled={isLoadingCep} label="Rua:" {...register('address.street')} />
              <InputWithLabel disabled={isLoadingCep} label="Número:" {...register('address.number')} />
              <InputWithLabel disabled={isLoadingCep} label="Complemento:" {...register('address.complement')} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" disabled={fetcher.state === 'submitting'}>Cancelar</Button>
            <Button disabled={fetcher.state === 'submitting'}>Salvar alterações</Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
 
export default EditCompanyDialog;