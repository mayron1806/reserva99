import { useFetcher, useNavigate } from "@remix-run/react";
import { useRemixForm } from "remix-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionCallback } from "~/hooks/use-action-callback";
import { toast } from "~/components/ui/use-toast";
import { useEffect } from "react";
import { normalizePhoneNumber } from "~/masks";
import { InputWithLabel } from "~/components/input-with-label";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { CreateClientSchema, createClientSchema } from "./validation/create-client";

const CreateClient = () => {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === 'submitting';
  const {
    handleSubmit,
    watch,
    setValue,
    register,
    formState: { errors },
  } = useRemixForm<CreateClientSchema>({
    resolver: zodResolver(createClientSchema),
    fetcher,
  });
  useActionCallback(fetcher, {
    onSuccess() {
      toast({
        title: 'Sucesso',
        description: 'Cliente adicionado com sucesso',
      });
      navigate('/admin/clients');
    },
    onError(message) {
      toast({
        title: 'Erro',
        description: message ?? 'Ocorreu um erro ao tentar cadastrar o cliente',
        variant: 'destructive'
      });
    },
  });

  //#region masks
  const phone = watch('phone');
  useEffect(() => {
    if(phone) setValue('phone', normalizePhoneNumber(phone));
  }, [phone]);
  //#endregion
  
  return (
    <main className="flex flex-1 flex-col h-full p-4 md:p-8">
      <fetcher.Form onSubmit={handleSubmit}>
        <Card className="h-full flex-1">
          <CardHeader>
            <CardTitle>Criar Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-2 py-4 m-2">
              <InputWithLabel label="Nome: *" {...register('name')} error={errors.name?.message} />
              <InputWithLabel label="Apelido:" {...register('alias')} error={errors.alias?.message} />
              <InputWithLabel label="E-mail:" {...register('email')} error={errors.email?.message} />
              <InputWithLabel label="Telefone:" {...register('phone')} error={errors.phone?.message} />
            </div>
          </CardContent>
          <CardFooter className="gap-2">
            <Button disabled={isSubmitting} type="button" variant="outline" onClick={() => navigate('/admin/clients')}>Cancelar</Button>
            <Button loading={isSubmitting}>Criar</Button>
          </CardFooter>
        </Card>
      </fetcher.Form>
    </main>
  );
}
 
export default CreateClient;