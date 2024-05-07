import { LoaderFunctionArgs, json, redirect } from "@remix-run/node"
import { authenticate } from "~/lib/auth.server";
type LoaderData = {
  ok: boolean;
  status: number;
  errorMessage?: string;
}
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { headers, logged } = await authenticate(request, new Headers());
  if (logged) {
    return redirect('/', {
      headers,
    });
  }
  const url = new URL(request.url);
  const token = url.searchParams.get('token');
  if (!token) {
    return json({
      ok: false,
      status: 400,
      errorMessage: 'Link de alteração de senha invalido, tente gerar um novo link.',
    } as LoaderData);
  }
  return json({
    ok: true,
    status: 200,
  } as LoaderData, {
    headers
  });
}