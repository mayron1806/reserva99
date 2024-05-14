import { json } from "@remix-run/node";
import { withAuthLoader } from "~/middlewares/with-auth-loader";
import { getClient } from "~/services/client/get-client";
import { getServiceList } from "~/services/service/get-service-list";
import { getTime } from "~/services/time/get-time";
import { Client } from "~/types/client";
import { Service } from "~/types/service";
import { WeekTime } from "~/types/time";

export type LoaderData = {
  serviceList: Pick<Service, 'id' | 'name'>[];
  clientList: Pick<Client, 'id' | 'name' | 'alias'>[];
  weekTime: WeekTime;
}
export const loader = withAuthLoader(async ({ request, token, headers }) => {
  const services = await getServiceList(request);
  const clients = await getClient(request, token);
  const weekTime = await getTime(request, token);
  if (!services.success) {
    throw json(services.errorMessage, { status: services.status, headers });
  }
  if (!clients.success) {
    throw json(clients.errorMessage, { status: clients.status, headers });
  }
  if(!weekTime.success) {
    throw json(weekTime.errorMessage, { status: weekTime.status, headers });
  }
  return json({ 
    serviceList: services.data, 
    clientList: clients.data, 
    weekTime: weekTime.data 
  } as LoaderData, { headers });
});
