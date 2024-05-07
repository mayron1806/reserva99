import { useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import { useRemixForm } from "remix-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionCallback } from "~/hooks/use-action-callback";
import { toast } from "~/components/ui/use-toast";
import { useEffect } from "react";
import { normalizePhoneNumber } from "~/masks";
import { InputWithLabel } from "~/components/input-with-label";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { LoaderData, loader } from "./loader";
import { ToastAction } from "~/components/ui/toast";
import DeleteClientDialog from "./components/delete-client-dialog";
import { UpdateClientSchema, updateClientSchema } from "./validation/update-client";

const UpdateService = () => {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const data: LoaderData = useLoaderData<typeof loader>();
  const isSubmitting = fetcher.state === 'submitting';
  
  //#region form
  const {
    handleSubmit,
    watch,
    setValue,
    register,
    formState: { errors },
  } = useRemixForm<UpdateClientSchema>({
    resolver: zodResolver(updateClientSchema),
    fetcher,
    defaultValues: {
      name: data.data?.name,
      alias: data.data?.alias,
      email: data.data?.email,
      phone: data.data?.phone
    }
  });
  //#endregion

  //#region action callback
  useActionCallback(fetcher, {
    onSuccess() {
      toast({
        title: 'Sucesso',
        description: 'Serviço atualizado com sucesso',
      });
      navigate('/admin/clients');
    },
    onError(message) {
      toast({
        title: 'Erro',
        description: message ?? 'Ocorreu um erro ao tentar atualizar o serviço',
        variant: 'destructive'
      });
    },
  });
  //#endregion

  //#region masks
  const phone = watch('phone');
  useEffect(() => {
    if(phone) setValue('phone', normalizePhoneNumber(phone));
  }, [phone]);
  //#endregion
  
  useEffect(() => {
    if (!data.success) {
      toast({
        title: 'Erro',
        description: data.errorMessage ?? 'Ocorreu um erro ao tentar buscar os dados do cliente',
        variant: 'destructive',
        action: <ToastAction altText="Voltar" onClick={() => navigate('/admin/clients')}>Voltar</ToastAction>
      });
    } 
  }, []);
  
  return (
    <main className="flex flex-1 flex-col h-full p-4 md:p-8">
      <fetcher.Form onSubmit={handleSubmit}>
        <Card className="h-full flex-1">
          <CardHeader>
            <CardTitle>Editar Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-2 py-4 m-2">
              <input type="hidden" name="action" value="update-service" />
              <InputWithLabel label="Nome: *" {...register('name')} error={errors.name?.message} />
              <InputWithLabel label="Apelido:" {...register('alias')} error={errors.alias?.message} />
              <InputWithLabel label="E-mail:" {...register('email')} error={errors.email?.message} />
              <InputWithLabel label="Telefone:" {...register('phone')} error={errors.phone?.message} />
            </div>
          </CardContent>
          <CardFooter className="flex-col sm:flex-row gap-2">
            <Button className="w-full sm:w-min" disabled={isSubmitting} type="button" variant="outline" onClick={() => navigate('/admin/clients')}>Cancelar</Button>
            <DeleteClientDialog />
            <Button className="w-full sm:w-min" loading={isSubmitting} type="submit">Salvar alterações</Button>
          </CardFooter>
        </Card>
      </fetcher.Form>
    </main>
  );
}
 
export default UpdateService;