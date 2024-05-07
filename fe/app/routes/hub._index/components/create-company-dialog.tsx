import { zodResolver } from "@hookform/resolvers/zod";
import { useFetcher } from "@remix-run/react";
import { PlusCircle } from "lucide-react";
import { useRemixForm } from "remix-hook-form";
import { InputWithLabel } from "~/components/input-with-label";
import { TextAreaWithLabel } from "~/components/textarea-with-label";
import { Button } from "~/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Separator } from "~/components/ui/separator";
import { CreateCompanySchema, createCompanySchema } from "../validation/create-company";
import { useEffect } from "react";
import { normalizeCepNumber, normalizeSubdomain } from "~/masks";
import { useCep } from "~/hooks/use-cep";

const CreateCompanyDialog = () => {
  const { getCepData, isLoading: isLoadingCep } = useCep();
  const fetcher = useFetcher();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useRemixForm<CreateCompanySchema>({
    resolver: zodResolver(createCompanySchema),
    fetcher,
  });
  const cep = watch('address.zipCode');
  const identifier = watch('identifier');
  //#region masks
  useEffect(() => {
    if (cep) setValue('address.zipCode', normalizeCepNumber(cep))
  }, [cep]);
  useEffect(() => {
    if (identifier) setValue('identifier', normalizeSubdomain(identifier));
  }, [identifier]);
  //#endregion
  
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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline'>
          <PlusCircle className="w-4 h-4 mr-2"/>
          Criar companhia
        </Button>
      </DialogTrigger>
      <DialogContent>
        <fetcher.Form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Criar nova companhia</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <InputWithLabel label="Nome: *" {...register('name')} error={errors.name?.message} />
            <InputWithLabel label="Identificador: *" {...register('identifier')} error={errors.identifier?.message} />
            <TextAreaWithLabel label="Descrição: " {...register('description')} error={errors.description?.message} />
            <Separator />
            <InputWithLabel label="CEP:" {...register('address.zipCode')} />
            <div className="grid grid-cols-2 gap-2">
              <InputWithLabel disabled={isLoadingCep} label="País:" {...register('address.country')} error={errors.address?.country?.message} />
              <InputWithLabel disabled={isLoadingCep} label="Estado:" {...register('address.state')} error={errors.address?.state?.message} />
              <InputWithLabel disabled={isLoadingCep} label="Cidade:" {...register('address.city')} error={errors.address?.city?.message} />
              <InputWithLabel disabled={isLoadingCep} label="Bairro:" {...register('address.district')} error={errors.address?.district?.message} />
              <InputWithLabel disabled={isLoadingCep} label="Rua:" {...register('address.street')} error={errors.address?.street?.message} />
              <InputWithLabel disabled={isLoadingCep} label="Número:" {...register('address.number')} error={errors.address?.number?.message} />
              <InputWithLabel disabled={isLoadingCep} label="Complemento:" {...register('address.complement')} error={errors.address?.complement?.message} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={fetcher.state === 'submitting'}>Cancelar</Button>
            </DialogClose>
            <Button disabled={fetcher.state === 'submitting'} type="submit" name="intent" value="create">Criar</Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}
 
export default CreateCompanyDialog;