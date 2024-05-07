import { json } from "@remix-run/node";
import { withAuthLoader } from "~/middlewares/with-auth-loader";
import { getService } from "~/services/service/get-service";
import { Service } from "~/types/service";
export type LoaderData = {
  services: Service[]
}
export const loader = withAuthLoader(async ({ headers, request, token }) => {
  const services = await getService(request, token);
  if (!services.success) {
    throw json(services.errorMessage, { status: services.status, headers });
  }
  return json({ services: services.data }, { headers });
});