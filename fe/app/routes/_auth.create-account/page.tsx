import { Form, useNavigation } from "@remix-run/react";
import { InputWithLabel } from "~/components/input-with-label";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { useRemixForm } from "remix-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateUserSchema, createUserSchema } from "./validation/create-account-schema";
import { useActionCallback } from "~/hooks/use-action-callback";
import { toast } from "~/components/ui/use-toast";
import Link from "~/components/link";


const LoginPage = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useRemixForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema)
  });
  useActionCallback(undefined, {
    onSuccess() {
      toast({
        title: 'Sucesso',
        description: `Enviamos um e-mail para ${watch('email')}, confirme esse e-mail para criar sua conta.`,
      })
    },
    onError(errorMessage) {
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive'
      });
    },
  })
  return ( 
    <div className="w-screen h-screen flex items-center justify-center">
      <Form onSubmit={handleSubmit} method="post" className="min-w-80">
        <Card>
          <CardHeader>
            <CardTitle>
              Criar conta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <InputWithLabel {...register('nick')} placeholder="Nome" label="Nome: *" error={errors.nick?.message} />
            <InputWithLabel {...register('email')} autoComplete="email" placeholder="E-mail" label="E-mail: *" error={errors.email?.message} />
            <InputWithLabel {...register('password')} type="password" placeholder="Senha" label="Senha: *" error={errors.password?.message} />
            <InputWithLabel {...register('confirmPassword')} type="password" placeholder="Confirmar senha" label="Confirmar senha: *" error={errors.confirmPassword?.message} />
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button loading={isSubmitting} className="mb-2">Criar conta</Button>
            <Link href="/login" aria-disabled={isSubmitting}>Entrar na minha conta</Link>
          </CardFooter>
        </Card>
      </Form>
    </div>
  );
}
export default LoginPage;