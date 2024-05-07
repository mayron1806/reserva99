import { json } from "@remix-run/node";
import { withAuthLoader } from "~/middlewares/with-auth-loader";
import { getClient } from "~/services/client/get-client";
import { getServiceList } from "~/services/service/get-service-list";
import { Client } from "~/types/client";
import { Service } from "~/types/service";

export type LoaderData = {
  serviceList: Pick<Service, 'id' | 'name'>[];
  clientList: Pick<Client, 'id' | 'name' | 'alias'>[];
}
export const loader = withAuthLoader(async ({ request, token, headers }) => {
  const services = await getServiceList(request);
  const clients = await getClient(request, token);
  if (!services.success) {
    throw json(services.errorMessage, { status: services.status, headers });
  }
  if (!clients.success) {
    throw json(clients.errorMessage, { status: clients.status, headers });
  }
  return json({ serviceList: services.data, clientList: clients.data } as LoaderData, { headers });
});
