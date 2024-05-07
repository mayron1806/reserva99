import { Form, useLoaderData, useNavigate, useNavigation } from "@remix-run/react";
import { InputWithLabel } from "~/components/input-with-label";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { useRemixForm } from "remix-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordSchema, forgotPasswordSchema } from "./validation/reset-password-schema";
import { useActionCallback } from "~/hooks/use-action-callback";
import { toast } from "~/components/ui/use-toast";
import { loader } from "./loader";
import { AlertCircle } from "lucide-react";
import { ToastAction } from "~/components/ui/toast";


const ResetPasswordPage = () => {
  const loaderData = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useRemixForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema)
  });
  useActionCallback(undefined, {
    onSuccess() {
      toast({
        title: 'Sucesso',
        description: `Senha alterada, clique no botão ao lado para fazer login.`,
        action: <ToastAction onClick={() => navigate('/login')} altText="Login">Login</ToastAction>,
      })
    },
    onError(errorMessage) {
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive'
      });
    },
  });
  if (!loaderData?.ok) return <ErrorPage errorMessage={loaderData?.errorMessage} />;
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Form onSubmit={handleSubmit} method="post" className="min-w-80">
        <Card>
          <CardHeader>
            <CardTitle>
              Alterar senha
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <InputWithLabel {...register('password')} type="password" placeholder="Senha" label="Senha: *" error={errors.password?.message} />
            <InputWithLabel {...register('confirmPassword')} type="password" placeholder="Confirmar senha" label="Confirmar senha: *" error={errors.confirmPassword?.message} />
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button loading={isSubmitting} className="mb-2">Alterar senha</Button>
            <a href="/login" aria-disabled={isSubmitting}>Voltar para login</a>
          </CardFooter>
        </Card>
      </Form>
    </div>
  );
}
const ErrorPage = ({ errorMessage }: { errorMessage?: string }) => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-4 p-4 text-center">
      <AlertCircle className="w-20 h-20 text-destructive" />
      <p>{errorMessage ? errorMessage : 'Link de alteração de senha invalido, tente gerar um novo link.'}</p>
      <Button onClick={() => navigate('/forgot-password')}>Gerar novo link</Button>
    </div>
  )
}
export default ResetPasswordPage;