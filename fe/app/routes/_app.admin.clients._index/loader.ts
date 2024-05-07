import { json } from "@remix-run/node";
import { withAuthLoader } from "~/middlewares/with-auth-loader";
import { getClient } from "~/services/client/get-client";
import { Client } from "~/types/client";
export type LoaderData = {
  clients: Client[]
}
export const loader = withAuthLoader(async ({ headers, request, token, }) => {
  const url = new URL(request.url);
  const filter = url.searchParams.get("filter") || undefined;
  const clients = await getClient(request, token, filter);
  if (!clients.success) {
    throw json(clients.errorMessage, { status: clients.status, headers });
  }
  return json({ clients: clients.data } as LoaderData, { headers });
});