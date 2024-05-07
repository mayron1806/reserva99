import { LoaderFunctionArgs, json } from "@remix-run/node";
import { activeAccount } from "~/lib/auth.server";
type LoaderData = {
  ok: boolean;
  errorMessage?: string;
  status: number;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');
  if (!token) {
    return json({
      ok: false,
      status: 400,
      errorMessage: 'Ocorreu um erro ao tentar ativar sua conta, tente fazer login para enviarmos um novo link para ativação.',
    } as LoaderData);
  }
  const data = await activeAccount(token);
  if (!data.success) {
    return json({
      ok: data.success,
      status: data.status,
      errorMessage: data.errorMessage,
    } as LoaderData);
  }
  return json({
    ok: data.success,
    status: data.status,
  } as LoaderData);
}