import { useLoaderData, useNavigation } from "@remix-run/react";
import { MinusCircle, PlusCircle } from "lucide-react";
import { InputWithLabel } from "~/components/input-with-label";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { LoaderData, loader } from "../loader";
import { Separator } from "~/components/ui/separator";
import { useRemixForm } from "remix-hook-form";
import { useFieldArray } from "react-hook-form";
import { CreateOrUpdateTimeSchema, createOrUpdateTimeSchema } from "../validation/create-or-update-time";
import { zodResolver } from "@hookform/resolvers/zod";
import { normalizeTime } from "~/masks";
import { useActionCallback } from "~/hooks/use-action-callback";
import { toast } from "~/components/ui/use-toast";
import ErrorMessage from "~/components/error-message";
import { Days, WeekTime, daysOfWeek } from "~/types/time";

const WorkTime = () => {
  const data: LoaderData = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isLoading = navigation.state === 'submitting';
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    reset,
  } = useRemixForm<CreateOrUpdateTimeSchema>({
    resolver: zodResolver(createOrUpdateTimeSchema),
    defaultValues: data.weektimes
  });
  const editMode = watch('edit');
  const { fields: fieldsMonday, append: appendMonday, remove: removeMonday } = useFieldArray({ control, name: 'monday' });
  const { fields: fieldsTuesday, append: appendTuesday, remove: removeTuesday } = useFieldArray({ control, name: 'tuesday' });
  const { fields: fieldsWednesday, append: appendWednesday, remove: removeWednesday } = useFieldArray({ control, name: 'wednesday' });
  const { fields: fieldsThursday, append: appendThursday, remove: removeThursday } = useFieldArray({ control, name: 'thursday' });
  const { fields: fieldsFriday, append: appendFriday, remove: removeFriday } = useFieldArray({ control, name: 'friday' });
  const { fields: fieldsSaturday, append: appendSaturday, remove: removeSaturday } = useFieldArray({ control, name: 'saturday' });
  const { fields: fieldsSunday, append: appendSunday, remove: removeSunday } = useFieldArray({ control, name: 'sunday' });
  const fields = {
    "monday": { fields: fieldsMonday, append: appendMonday, remove: removeMonday },
    "tuesday": { fields: fieldsTuesday, append: appendTuesday, remove: removeTuesday },
    "wednesday": { fields: fieldsWednesday, append: appendWednesday, remove: removeWednesday },
    "thursday": { fields: fieldsThursday, append: appendThursday, remove: removeThursday },
    "friday": { fields: fieldsFriday, append: appendFriday, remove: removeFriday },
    "saturday": { fields: fieldsSaturday, append: appendSaturday, remove: removeSaturday },
    "sunday": { fields: fieldsSunday, append: appendSunday, remove: removeSunday }
  }
  
  const handleEdit = (edit: boolean) => {
    reset();
    setValue('edit', edit);
    if (edit) {
      if (data.weektimes.monday?.length === 0) fields.monday.append({});
      if (data.weektimes.tuesday?.length === 0) fields.tuesday.append({});
      if (data.weektimes.wednesday?.length === 0) fields.wednesday.append({});
      if (data.weektimes.thursday?.length === 0) fields.thursday.append({});
      if (data.weektimes.friday?.length === 0) fields.friday.append({});
      if (data.weektimes.saturday?.length === 0) fields.saturday.append({});
      if (data.weektimes.sunday?.length === 0) fields.sunday.append({});
    }
  }
  useActionCallback<WeekTime>(undefined, {
    onSuccess() {
      toast({
        title: 'Sucesso',
        description: 'Horario de funcionamento atualizado com sucesso.'
      });
      setValue('edit', false);
    },
    onError(errorMessage) {
      toast({
        title: 'Erro',
        description: errorMessage ?? 'Ocorreu um erro ao tentar atualizar o horário de funcionamento.',
        variant: 'destructive',
      });
    },
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Horários de funcionamento</CardTitle>
        <CardDescription>
        Defina os dias e horários em que deseja permitir agendamentos, limitando as marcações fora desses períodos determinados.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} method="post">
        <CardContent className="space-y-2">
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
                            disabled={!editMode}
                            ref={register(`${v}.${index}.start`).ref}
                            placeholder="Ex: 08:00" 
                            id={`${v}.${index}.start`}
                            error={errors[v]?.[index]?.start?.message}
                            name={`${v}.${index}.start`}
                            onChange={(e) => {
                              e.target.value = normalizeTime(e.target.value);
                              register(`${v}.${index}.start`).onChange(e);
                            }}
                          />
                          <span className="text-center mt-1.5">até</span>
                          <InputWithLabel 
                            className="col-span-2" 
                            ref={register(`${v}.${index}.end`).ref}
                            disabled={!editMode}
                            placeholder="Ex: 18:00" 
                            id={`${v}.${index}.end`}
                            error={errors[v]?.[index]?.end?.message}
                            name={`${v}.${index}.end`}
                            onChange={(e) => {
                              e.target.value = normalizeTime(e.target.value);
                              register(`${v}.${index}.end`).onChange(e);
                            }}
                          />
                          {
                            editMode &&
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
                          }
                        </div>
                      ))
                    }
                    {
                      errors[v]?.root?.message &&
                      <ErrorMessage>{errors[v]?.root?.message}</ErrorMessage>
                    }
                  </div>
                </div>
                <Separator />
              </div>
            ))
          }
        </CardContent>
        <CardFooter className="flex gap-2">
          {
            editMode &&
              <>
                <Button onClick={() => handleEdit(false)} size="sm" variant="outline" type="button" disabled={isLoading}>Cancelar</Button>
                <Button size="sm" loading={isLoading}>Salvar Alterações</Button>
              </>
          }
          {
            !editMode &&
              <>
                <Button onClick={() => handleEdit(true)} size="sm" type="button" disabled={isLoading}>Editar</Button>
              </>
          }
        </CardFooter>
      </form>
    </Card>
  );
}
 
export default WorkTime;