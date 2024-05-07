import { HTTPResponse, http } from "~/lib/http/http.server";
import { getSubdomain } from "~/lib/subdomain.server";
import { Service } from "~/types/service";

export const getServiceById = async (request: Request, serviceId: string) => {
  const subdomain = getSubdomain(request);
  const { data } = await http.get<HTTPResponse<Service>>(`/company/${subdomain}/service/${serviceId}`, {
  });
  return data;
}