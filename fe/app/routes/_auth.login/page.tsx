import { Form, useActionData, useNavigation } from "@remix-run/react";
import { InputWithLabel } from "~/components/input-with-label";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { action } from "./action";
import Link from "~/components/link";


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
          <CardContent>
              <InputWithLabel name="account" type="text" className="mb-2" autoComplete="email" placeholder="Nome ou e-mail" label="Nome ou e-mail: *" />
              <InputWithLabel name="password" type="password" autoComplete="current-password" placeholder="Senha" label="Senha: *"  />
              <Link href="/forgot-password" aria-disabled={isSubmitting}>Esqueci minha senha</Link>
          </CardContent>
          <CardFooter className="flex flex-col">
            <p className="text-destructive">{data?.error}</p>
            <Button disabled={isSubmitting} loading={isSubmitting}>Entrar</Button>
            <div className="inline-flex h-10 items-center justify-center w-full">
                <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
                <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">OU</span>
            </div>
            <Link href="/create-account" aria-disabled={isSubmitting}>Criar conta</Link>
          </CardFooter>
        </Card>
      </Form>
    </div>
  );
}
export default LoginPage;