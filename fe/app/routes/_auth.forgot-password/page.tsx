import { Form, useActionData, useNavigation } from "@remix-run/react";
import { InputWithLabel } from "~/components/input-with-label";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { action } from "./action";
import { useRemixForm } from "remix-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordSchema, forgotPasswordSchema } from "./validation/forgot-password-schema";
import { useActionCallback } from "~/hooks/use-action-callback";
import { toast } from "~/components/ui/use-toast";


const LoginPage = () => {
  const data = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useRemixForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema)
  });
  useActionCallback(undefined, {
    onSuccess() {
      toast({
        title: 'Sucesso',
        description: `E-mail enviado.`,
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
              Esqueci minha senha
            </CardTitle>
            <CardDescription>
              Caso tenha esquecido sua senha preencha o campo abaixo com o email da sua conta, um email será enviado para ele com um link, onde você pode alterar sua senha.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <InputWithLabel {...register('email')} autoComplete="email" placeholder="E-mail" label="E-mail: *" error={errors.email?.message} />
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button loading={isSubmitting} className="mb-2">Enviar email</Button>
            <a href="/login" aria-disabled={isSubmitting}>Voltar para login</a>
          </CardFooter>
        </Card>
      </Form>
    </div>
  );
}
export default LoginPage;