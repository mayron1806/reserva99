import { Form, useActionData, useNavigation } from "@remix-run/react";
import { InputWithLabel } from "~/components/input-with-label";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { action } from "./action";


const LoginPage = () => {
  const data = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.formAction === '/login';
  return ( 
    <div className="w-screen h-screen flex items-center justify-center">
      <Form method="post" className="min-w-80">
        <Card>
          <CardHeader>
            <CardTitle>
              Entrar na minha conta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
              <InputWithLabel name="account" type="text" autoComplete="email" placeholder="Nome ou e-mail" label="Nome ou e-mail: *" />
              <InputWithLabel name="password" type="password" autoComplete="current-password" placeholder="Senha" label="Senha: *"  />
          </CardContent>
          <CardFooter className="flex flex-col">
            <p className="text-destructive">{data?.error}</p>
            <Button disabled={isSubmitting} loading={isSubmitting}>Entrar</Button>
            <a href="/create-account" aria-disabled={isSubmitting}>Criar conta</a>
            <a href="/forgot-password" aria-disabled={isSubmitting}>Esqueci minha senha</a>
          </CardFooter>
        </Card>
      </Form>
    </div>
  );
}
export default LoginPage;