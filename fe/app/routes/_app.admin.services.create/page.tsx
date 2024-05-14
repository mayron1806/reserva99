import { useFetcher, useNavigate } from "@remix-run/react";
import { useRemixForm } from "remix-hook-form";
import { CreateServiceSchema, createServiceSchema } from "./validation/create-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionCallback } from "~/hooks/use-action-callback";
import { toast } from "~/components/ui/use-toast";
import { useFieldArray } from "react-hook-form";
import { useEffect } from "react";
import Radio from "~/components/radio-group";
import { normalizeMoney, normalizeTime } from "~/masks";
import { X } from "lucide-react";
import { InputWithLabel } from "~/components/input-with-label";
import SimpleToolTip from "~/components/simple-tooltip";
import { TextAreaWithLabel } from "~/components/textarea-with-label";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";

const CreateService = () => {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === 'submitting';
  const {
    reset, 
    handleSubmit,
    watch,
    setValue,
    register,
    formState: { errors },
    control,
  } = useRemixForm<CreateServiceSchema>({
    resolver: zodResolver(createServiceSchema),
    fetcher,
  });
  useActionCallback(fetcher, {
    onSuccess() {
      toast({
        title: 'Sucesso',
        description: 'Serviço adicionado com sucesso',
      });
      navigate('/admin/services');
    },
    onError(message) {
      toast({
        title: 'Erro',
        description: message ?? 'Ocorreu um erro ao tentar cadastrar o serviço',
        variant: 'destructive'
      });
    },
  })

  //#region variantes
  const { fields, append, remove } = useFieldArray({ control, name: "variants" });
  const handleAddVariant = () => {
    append({
      name: '',
      description: '',
      duration: '',
      price: '',
    });
  }
  const handleRemoveVariant = (index: number) => remove(index);
  useEffect(() => {
    if (watch('containVariants') && watch('variants')?.length === 0) {
      handleAddVariant();
    }
  }, [watch('containVariants')])
  //#endregion
  
  //#region masks
  const price = watch('price');
  useEffect(() => {
    if(price) setValue('price', normalizeMoney(price));
  }, [price]);
  //#endregion
  
  return (
    <main className="flex flex-1 flex-col h-full p-4 md:p-8">
      <fetcher.Form onSubmit={handleSubmit}>
        <Card className="h-full flex-1">
          <CardHeader>
            <CardTitle>Criar Serviço</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-2 py-4 m-2">
              <InputWithLabel label="Nome: *" {...register('name')} error={errors.name?.message} />
              <InputWithLabel label="Identificador:" {...register('identifier')} error={errors.identifier?.message} />
              <TextAreaWithLabel className="col-span-2" label="Descrição:" {...register('description')} error={errors.description?.message} />
              <Radio
                id="client-link"
                className="col-span-2"
                options={[{label: 'Sim', value: 'true'}, {label: 'Não', value: 'false'}]}
                label="Clientes podem realizar agendamentos através do link?"
              />
              <Radio
                id="variants"
                className="col-span-2"
                value={`${watch('containVariants')}`} 
                onValueChange={(v)=> setValue('containVariants', v === 'true')}
                options={[{label: 'Sim', value: 'true'}, {label: 'Não', value: 'false'}]}
                label="O serviço contém variações?"
              />
              
              {
                !watch('containVariants') &&
                <>
                  <InputWithLabel label="Preço: *" {...register('price')} error={errors.price?.message} />
                  <InputWithLabel 
                    label="Duração: *"
                    ref={register(`duration`).ref}
                    placeholder="Ex: 01:00" 
                    id={`duration`}
                    error={errors.duration?.message}
                    name={`duration`}
                    onChange={(e) => {
                      e.target.value = normalizeTime(e.target.value);
                      register(`duration`).onChange(e);
                    }}
                  />
                </>
              }
              {
                watch('containVariants') &&
                <div className="col-span-2 space-y-4">
                  {
                    fields.map((variant, index) => (
                      <div key={variant.id}>
                        <Separator />
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div className="flex justify-between col-span-2">
                            <h4 className="font-bold mt-2 col-span-2">Variação {index + 1}</h4>
                            <SimpleToolTip text="Excluir variante">
                              <Button onClick={() => handleRemoveVariant(index)} variant='ghost' className="hover:bg-transparent hover:text-destructive">
                                <X />
                              </Button>
                            </SimpleToolTip>
                          </div>
                          <InputWithLabel 
                            label="Nome: *" 
                            {...register(`variants.${index}.name`)}
                            error={errors.variants?.[index]?.name?.message} 
                          />
                          <InputWithLabel 
                            label="Preço: *" 
                            onChange={(e) => {
                              e.target.value = normalizeMoney(e.target.value);
                              register(`variants.${index}.price`).onChange(e);
                            }}
                            name={`variants.${index}.price`}
                            id={`variants.${index}.price`}
                            ref={register(`variants.${index}.price`).ref}
                            error={errors.variants?.[index]?.price?.message} 
                          />
                          <InputWithLabel 
                            label="Duração: *"
                            ref={register(`variants.${index}.duration`).ref}
                            placeholder="Ex: 01:00" 
                            id={`variants.${index}.duration`}
                            error={errors.variants?.[index]?.duration?.message}
                            name={`variants.${index}.duration`}
                            onChange={(e) => {
                              e.target.value = normalizeTime(e.target.value);
                              register(`variants.${index}.duration`).onChange(e);
                            }}
                          />
                          <TextAreaWithLabel 
                            className="col-span-2" 
                            label="Descrição:" 
                            {...register(`variants.${index}.description`)} 
                            error={errors.variants?.[index]?.description?.message}
                          />
                        </div>
                      </div>
                    ))
                  }
                </div>
              }
              {
                watch('containVariants') &&
                <Button className="col-span-2" type="button" onClick={handleAddVariant}>Criar mais variações</Button>
              }
            </div>
          </CardContent>
          <CardFooter className="gap-2">
            <Button disabled={isSubmitting} type="button" variant="outline" onClick={() => navigate('/admin/services')}>Cancelar</Button>
            <Button loading={isSubmitting}>Criar serviço</Button>
          </CardFooter>
        </Card>
      </fetcher.Form>
    </main>
  );
}
 
export default CreateService;