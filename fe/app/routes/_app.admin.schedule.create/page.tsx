import { useLoaderData, useNavigate, useNavigation } from "@remix-run/react";
import { LoaderData, loader } from "./loader";
import { useServiceLoader } from "./hooks/useServiceLoader";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { useRemixForm } from "remix-hook-form";
import { CreateScheduleSchema, createScheduleSchema } from "./validation/create-schedule";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import { InputWithLabel } from "~/components/input-with-label";
import { useEffect, useMemo } from "react";
import { normalizeMoney, normalizePhoneNumber, normalizeTime } from "~/masks";
import { Separator } from "~/components/ui/separator";
import { Combobox } from "~/components/combobox";
import { Skeleton } from "~/components/ui/skeleton";
import { durationFormat } from "~/formats/time-format";
import { DatePicker } from "~/components/date-picker";
import { useTimeLoader } from "./hooks/useTimeLoader";
import moment from "moment";
import { TimeSelect, TimeSelectItem } from "./components/time-select";
import { useActionCallback } from "~/hooks/use-action-callback";
import { toast } from "~/components/ui/use-toast";
import Radio from "~/components/radio-group";
import DateTimePicker from "~/components/date-time-picker";

const CreateSchedulePage = () => {
  const data: LoaderData = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const isSubmitting = navigation.state === 'submitting';
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
  } = useRemixForm<CreateScheduleSchema>({
    resolver: zodResolver(createScheduleSchema),
    defaultValues: {
      createClient: false,
    }
  });
  useActionCallback(undefined, {
    onSuccess() {
      toast({
        title: 'Sucesso',
        description: 'Agendamento adicionado com sucesso',
      });
      navigate('/admin/schedule');
    },
    onError(message) {
      toast({
        title: 'Erro',
        description: message ?? 'Ocorreu um erro ao tentar cadastrar o agendamento',
        variant: 'destructive'
      });
    },
  });
  //#region mask
  const clientPhone = watch('client.phone');
  useEffect(() => {
    if (clientPhone) setValue('client.phone', normalizePhoneNumber(clientPhone));
  }, [clientPhone]);
  //#endregion
  
  const { data: selectedService, isLoading: isFetchingService, trigger: loadServiceData } = useServiceLoader(watch('serviceId'));
  const { data: times, isLoading: isFetchingTimes, trigger: loadTimes } = useTimeLoader({ 
    date: watch('date'), 
    serviceId: watch('serviceId'), 
    variantId: watch('variantId')
  });

  const handleSelectService = (serviceId: string) => {
    setValue('serviceId', serviceId);
    loadServiceData({ id: serviceId });
  }
  const handleSelectDate = (date: string) => {
    setValue('date', date);
    loadTimes({ 
      date: watch('date'), 
      serviceId: watch('serviceId'), 
      variantId: watch('variantId')
    });
  }
  const isServiceSelected = (!!selectedService && !selectedService.containVariants) || (selectedService?.containVariants && !!watch('variantId')) || false;
 
  const createClient = watch('createClient');
  useEffect(() => {
    if (createClient) {
      setValue('clientId', '');
    } else {
      setValue('client', null);
    }
  }, [createClient]);
  useEffect(() => {
    if (isServiceSelected && (!times || times?.length === 0)) {
      handleSelectDate(moment().toDate().toISOString());
    }
  }, [isServiceSelected]);

  const disabledDays = useMemo(() => {
    const { weekTime } = data;
    const weekMap = {
      "sunday": 0,
      "monday": 1,
      "tuesday": 2,
      "wednesday": 3,
      "thursday": 4,
      "friday": 5,
      "saturday": 6,
    };
    const days: number[] = [];
    if (weekTime.monday?.every(t => t.start === '' && t.end === '')) days.push(weekMap['monday']);
    if (weekTime.tuesday?.every(t => t.start === '' && t.end === '')) days.push(weekMap['tuesday']);
    if (weekTime.wednesday?.every(t => t.start === '' && t.end === '')) days.push(weekMap['wednesday']);
    if (weekTime.thursday?.every(t => t.start === '' && t.end === '')) days.push(weekMap['thursday']);
    if (weekTime.friday?.every(t => t.start === '' && t.end === '')) days.push(weekMap['friday']);
    if (weekTime.saturday?.every(t => t.start === '' && t.end === '')) days.push(weekMap['saturday']);
    if (weekTime.sunday?.every(t => t.start === '' && t.end === '')) days.push(weekMap['sunday']);
    return days;
  }, [data.weekTime]);

  const price = watch('price');
  const duration = watch('duration');
  //#region masks
  useEffect(() => {
    if(price) setValue('price', normalizeMoney(price));
  }, [price]);
  useEffect(() => {
    if(duration) setValue('duration', normalizeTime(duration));
  }, [duration]);
  //#endregion

  //#region populate duration and price
  useEffect(() => {
    setValue('duration', 
      durationFormat(selectedService?.containVariants ? 
        selectedService.variants?.find(v => v.id === watch('variantId'))?.duration! : 
        selectedService?.duration!
    ));
    setValue('price', 
      normalizeMoney(selectedService?.containVariants ? 
        selectedService.variants?.find(v => v.id === watch('variantId'))?.price.toString() : 
        selectedService?.price!.toString())
    );
  }, [selectedService]);
  return (
    <main className="flex flex-1 flex-col h-full p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>
            Criar agendamento
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-2 mb-2">
              <h4 className="sm:col-span-2 font-bold text-lg">Paciente</h4>
              <Radio
                className="col-span-2"
                value={`${watch('createClient')}`} 
                onValueChange={(v)=> setValue('createClient', v === 'true')}
                options={[{label: 'Criar um novo', value: 'true'}, {label: 'Selecionar um existente', value: 'false'}]}
                label="Deseja criar um novo paciente ou selecionar um já existente?"
              />
              {
                watch('createClient') &&
                <>
                  <InputWithLabel label="Nome: *" {...register('client.name')} error={errors.client?.name?.message} />
                  <InputWithLabel label="Apelido: " {...register('client.alias')} error={errors.client?.alias?.message} />
                  <InputWithLabel type="email" label="E-mail: " {...register('client.email')} error={errors.client?.email?.message} />
                  <InputWithLabel label="Telefone: " {...register('client.phone')} error={errors.client?.phone?.message} />
                </>
              }
              {
                !watch('createClient') &&
                <>
                  <Combobox 
                    initialData={data.clientList.map(c => ({ label: `${c.name}${c.alias ? ' - ' + c.alias : ''}`, value: c.id}))}
                    label="Selecione um paciente: *"
                    emptyMessage="Nenhum paciente cadastrado"
                    error={errors.client?.root?.message}
                    buttonText="Paciente"
                    inputPlaceholder="Paciente"
                    value={{
                      label: data.clientList.find(c => c.id === watch('clientId'))?.name!,
                      value: data.clientList.find(c => c.id === watch('clientId'))?.id!
                    }}
                    onSelectValue={(v) => setValue('clientId', v.value.toString())}
                  />
                </>
              }
            </div>
            <Separator />
            <div className="flex flex-col gap-2 mt-2">
              <h4 className="font-bold text-lg">Agendamento</h4>
              <Combobox 
                buttonText="Escolha o servico" 
                label="Servico: *"
                emptyMessage="Nenhum serviço cadastrado"
                initialData={data.serviceList.map(s => ({ label: s.name, value: s.id }))}
                value={
                  watch('serviceId') ? { 
                    value: data.serviceList.find(s => s.id === watch('serviceId'))?.id!,
                    label: data.serviceList.find(s => s.id === watch('serviceId'))?.name!
                  } : undefined
                }
                error={errors.serviceId?.message}
                onSelectValue={(s => handleSelectService(s.value.toString()))}
              />
              {
                isFetchingService &&
                <>
                  <Skeleton className="w-full h-10" />
                </>
              }
              {
                selectedService?.variants && selectedService.variants.length > 0 &&
                <Combobox 
                  buttonText="Escolha a variação" 
                  label="Variação: *" 
                  initialData={selectedService?.variants?.map(v => ({ label: v.name, value: v.id }))}
                  value={
                    watch('variantId') ? { 
                      value: selectedService?.variants.find(s => s.id === watch('variantId'))?.id!,
                      label: selectedService?.variants.find(s => s.id === watch('variantId'))?.name!
                    } : undefined
                  }
                  onSelectValue={(s => setValue('variantId', s.value.toString()))}
                  error={errors.variantId?.message}
                />
              }
              {
                isServiceSelected &&
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <InputWithLabel
                    label="Preço: *"
                    disabled
                    defaultValue={normalizeMoney(selectedService?.containVariants ? 
                      selectedService.variants?.find(v => v.id === watch('variantId'))?.price.toString() : 
                      selectedService?.price!.toString())
                    }
                  />
                  <InputWithLabel 
                    label="Duração: " 
                    disabled
                    defaultValue={durationFormat(selectedService?.containVariants ? 
                      selectedService.variants?.find(v => v.id === watch('variantId'))?.duration! : 
                      selectedService?.duration!)
                    }
                  />
                  <Radio
                    className="col-span-2"
                    value={`${watch('paymentStatus')}`} 
                    onValueChange={(v)=> setValue('paymentStatus', v)}
                    options={[{label: 'Sim', value: 'paid'}, {label: 'Não', value: 'unpaid'}]}
                    label="O pagamento já foi efetuado? *"
                  />
                </div>
              }
            </div>
            {
              isServiceSelected &&
              <>
                <Separator />
                <div className="mt-2 flex flex-col gap-4">
                  <h4 className="sm:col-span-2 font-bold text-lg">Data</h4>
                  <DatePicker 
                    label="Dia do agendamento: *" 
                    date={watch('date')} 
                    setDate={date => date && handleSelectDate(date.toISOString())} 
                    error={errors.date?.message}
                    disabledCalendarMatches={[{ before: new Date() }, { dayOfWeek: disabledDays }]}
                  />
                  {
                    isFetchingTimes &&
                    <>
                      <Skeleton className="w-full h-10" />
                      <Skeleton className="w-full h-10" />
                      <Skeleton className="w-full h-10" />
                    </>
                  }
                  <TimeSelect>
                    {
                      times?.map(t => (
                        <TimeSelectItem
                          key={moment(t.time).toISOString()}
                          value={moment(t.time).toISOString()} 
                          setSelected={(v) => setValue('date', v)} 
                          disabled={!t.available}
                          selectedItem={watch('date')}
                        />
                      ))
                    }
                  </TimeSelect>
                </div>
              </>
            }
          </CardContent>
          <CardFooter className="gap-2">
            <Button disabled={isSubmitting} type="button" variant="outline" onClick={() => navigate('/admin/clients')}>Cancelar</Button>
            <Button loading={isSubmitting}>Criar</Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
 
export default CreateSchedulePage;