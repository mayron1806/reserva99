import { json, redirect } from "@remix-run/node";
import { withAuthLoader } from "~/middlewares/with-auth-loader";
import { getClientById } from "~/services/client/get-client-by-id";
import { Client } from "~/types/client";

export type LoaderData = {
  success: string;
  data?: Client;
  errorMessage?: string;
};
export const loader = withAuthLoader(async ({ request, params, token, headers }) => {
  if (!params.clientId) return redirect('/admin/clients', { headers });
  const data = await getClientById(request, token, params.clientId);
  if (data.success) {
    data.data.phone = data.data.phone?.replace('+55 ', '');
  }
  return json(data, { headers });
});