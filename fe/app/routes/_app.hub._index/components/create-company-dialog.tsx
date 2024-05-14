import { zodResolver } from "@hookform/resolvers/zod";
import { useFetcher } from "@remix-run/react";
import { MinusCircle, PlusCircle } from "lucide-react";
import { useRemixForm } from "remix-hook-form";
import { InputWithLabel } from "~/components/input-with-label";
import { TextAreaWithLabel } from "~/components/textarea-with-label";
import { Button } from "~/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Separator } from "~/components/ui/separator";
import { CreateCompanySchema, createCompanySchema } from "../validation/create-company";
import { useEffect } from "react";
import { normalizeCepNumber, normalizeSubdomain, normalizeTime } from "~/masks";
import { useCep } from "~/hooks/use-cep";
import { Days, daysOfWeek } from "~/types/time";
import { useFieldArray } from "react-hook-form";
import ErrorMessage from "~/components/error-message";
import { ScrollArea } from "~/components/ui/scroll-area";
import { CheckboxWithLabel } from "~/components/checkbox-with-label";
import { useActionCallback } from "~/hooks/use-action-callback";
import { toast } from "~/components/ui/use-toast";

const CreateCompanyDialog = () => {
  const { getCepData, isLoading: isLoadingCep } = useCep();
  const fetcher = useFetcher();
  const isLoading = fetcher.state === 'submitting';
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    setValue,
  } = useRemixForm<CreateCompanySchema>({
    resolver: zodResolver(createCompanySchema),
    fetcher,
    defaultValues: {
      workTime: {
        friday: [{}],
        monday: [{}],
        saturday: [{}],
        thursday: [{}],
        sunday: [{}],
        tuesday: [{}],
        wednesday: [{}],
      }
    }
  });
  useActionCallback(fetcher, {
    onError(errorMessage) {
      toast({
        title: 'Erro',
        variant: 'destructive',
        description: errorMessage ?? 'Erro ao criar companhia, verifique os dados informados.'
      })
    },
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

  const { fields: fieldsMonday, append: appendMonday, remove: removeMonday } = useFieldArray({ control, name: 'workTime.monday' });
  const { fields: fieldsTuesday, append: appendTuesday, remove: removeTuesday } = useFieldArray({ control, name: 'workTime.tuesday' });
  const { fields: fieldsWednesday, append: appendWednesday, remove: removeWednesday } = useFieldArray({ control, name: 'workTime.wednesday' });
  const { fields: fieldsThursday, append: appendThursday, remove: removeThursday } = useFieldArray({ control, name: 'workTime.thursday' });
  const { fields: fieldsFriday, append: appendFriday, remove: removeFriday } = useFieldArray({ control, name: 'workTime.friday' });
  const { fields: fieldsSaturday, append: appendSaturday, remove: removeSaturday } = useFieldArray({ control, name: 'workTime.saturday' });
  const { fields: fieldsSunday, append: appendSunday, remove: removeSunday } = useFieldArray({ control, name: 'workTime.sunday' });
  const fields = {
    "monday": { fields: fieldsMonday, append: appendMonday, remove: removeMonday },
    "tuesday": { fields: fieldsTuesday, append: appendTuesday, remove: removeTuesday },
    "wednesday": { fields: fieldsWednesday, append: appendWednesday, remove: removeWednesday },
    "thursday": { fields: fieldsThursday, append: appendThursday, remove: removeThursday },
    "friday": { fields: fieldsFriday, append: appendFriday, remove: removeFriday },
    "saturday": { fields: fieldsSaturday, append: appendSaturday, remove: removeSaturday },
    "sunday": { fields: fieldsSunday, append: appendSunday, remove: removeSunday }
  }

  const hideAddress = watch('hideAddress');
  useEffect(() => {
    if (hideAddress) {
      setValue('address', null);
    }
  }, [hideAddress]);
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline'>
          <PlusCircle className="w-4 h-4 mr-2"/>
          Criar companhia
        </Button>
      </DialogTrigger>
      <DialogContent>
        <ScrollArea className="max-h-[80vh]">
          <fetcher.Form onSubmit={handleSubmit} className="p-4">
            <DialogHeader>
              <DialogTitle>Criar nova companhia</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4 grid-cols-2">
              <InputWithLabel label="Nome: *" {...register('name')} error={errors.name?.message} />
              <InputWithLabel label="Identificador: *" {...register('identifier')} error={errors.identifier?.message} />
              <TextAreaWithLabel className="col-span-2" label="Informações: " {...register('description')} error={errors.description?.message} />
              <Separator className="col-span-2" />
              <div className="grid gap-4 col-span-2">
                <h3 className="font-bold pb-2">Endereço</h3>
                <CheckboxWithLabel 
                  label="Não possui endereço"
                  checked={hideAddress}
                  onClick={() => setValue('hideAddress', !hideAddress)}
                />
                {
                  !hideAddress &&
                  <>
                    <InputWithLabel label="CEP:" {...register('address.zipCode')} />
                    <div className="grid grid-cols-3 gap-2">
                      <InputWithLabel disabled={isLoadingCep} label="País:" {...register('address.country')} error={errors.address?.country?.message} />
                      <InputWithLabel disabled={isLoadingCep} label="Estado:" {...register('address.state')} error={errors.address?.state?.message} />
                      <InputWithLabel disabled={isLoadingCep} label="Cidade:" {...register('address.city')} error={errors.address?.city?.message} />
                      <InputWithLabel disabled={isLoadingCep} label="Bairro:" {...register('address.district')} error={errors.address?.district?.message} />
                      <InputWithLabel disabled={isLoadingCep} label="Rua:" {...register('address.street')} error={errors.address?.street?.message} />
                      <InputWithLabel disabled={isLoadingCep} label="Número:" {...register('address.number')} error={errors.address?.number?.message} />
                      <InputWithLabel disabled={isLoadingCep} label="Complemento:" {...register('address.complement')} error={errors.address?.complement?.message} />
                    </div>
                  </>
                }
                <Separator />
                <h3 className="font-bold pb-2">Horário de funcionamento</h3>
                {
                  (Object.keys(daysOfWeek) as Days[]).map((v) => (
                    <div key={v}>
                      <div className="flex flex-col md:flex-row">
                        <h4 className="font-bold w-20">{daysOfWeek[v]}</h4>
                        <div className="flex flex-col pb-4">
                          <div className="grid grid-cols-6 max-w-[400px]">
                            <p className="col-span-2 text-muted-foreground">Hora inicial</p>
                            <span className="text-center mt-1.5"></span>
                            <p className="col-span-2 text-muted-foreground">Hora final</p>
                          </div>
                          {
                            fields[v].fields.map((field, index) => (
                              <div className="grid grid-cols-6 max-w-[400px]" key={field.id}>
                                <InputWithLabel 
                                  className="col-span-2" 
                                  ref={register(`workTime.${v}.${index}.start`).ref}
                                  placeholder="Ex: 08:00" 
                                  id={`workTime.${v}.${index}.start`}
                                  error={errors.workTime?.[v]?.[index]?.start?.message}
                                  name={`workTime.${v}.${index}.start`}
                                  onChange={(e) => {
                                    e.target.value = normalizeTime(e.target.value);
                                    register(`workTime.${v}.${index}.start`).onChange(e);
                                  }}
                                />
                                <span className="text-center mt-1.5">até</span>
                                <InputWithLabel 
                                  className="col-span-2" 
                                  ref={register(`workTime.${v}.${index}.end`).ref}
                                  placeholder="Ex: 18:00" 
                                  id={`workTime.${v}.${index}.end`}
                                  error={errors.workTime?.[v]?.[index]?.end?.message}
                                  name={`workTime.${v}.${index}.end`}
                                  onChange={(e) => {
                                    e.target.value = normalizeTime(e.target.value);
                                    register(`workTime.${v}.${index}.end`).onChange(e);
                                  }}
                                />
                                <Button 
                                  type="button" 
                                  size="sm" 
                                  variant="link" 
                                  className="mb-5"
                                  onClick={() => {
                                    if (index + 1 === fields[v].fields.length) {
                                      fields[v].append({
                                        start: '',
                                        end: ''
                                      })
                                    } else fields[v].remove(index);
                                  }}
                                >
                                {
                                  index + 1 === fields[v].fields.length ? <PlusCircle /> : <MinusCircle />
                                }
                                </Button>
                              </div>
                            ))
                          }
                          {
                            errors.workTime?.[v]?.root?.message &&
                            <ErrorMessage>{errors.workTime?.[v]?.root?.message}</ErrorMessage>
                          }
                        </div>
                      </div>
                      <Separator />
                    </div>
                  ))
                }
                <ErrorMessage>{errors.workTime?.root?.message}</ErrorMessage>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isLoading}>Cancelar</Button>
              </DialogClose>
              <Button loading={isLoading} type="submit" name="intent" value="create">Criar</Button>
            </DialogFooter>
          </fetcher.Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
 
export default CreateCompanyDialog;