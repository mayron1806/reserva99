import { json, redirect } from "@remix-run/node";
import { withAuthLoader } from "~/middlewares/with-auth-loader";
import { getServiceById } from "~/services/service/get-service-by-id";
import { Service } from "~/types/service";

export type LoaderData = {
  success: string;
  data?: Service;
  errorMessage?: string;
};
export const loader = withAuthLoader(async ({ request, params, headers }) => {
  if (!params.serviceId) return redirect('/admin/services', { headers });
  const data = await getServiceById(request, params.serviceId);
  if(!data.success) throw json(data.errorMessage, { headers, status: data.status });
  console.log(data.data);
  
  return json(data, { headers });
});