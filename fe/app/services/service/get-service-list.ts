import { HTTPResponse, http } from "~/lib/http/http.server";
import { getSubdomain } from "~/lib/subdomain.server";
import { Service } from "~/types/service";

export const getServiceList = async (request: Request) => {
  const subdomain = getSubdomain(request);
  const { data } = await http.get<HTTPResponse<Pick<Service, 'id' | 'name'>[]>>(`/company/${subdomain}/service/list`);
  return data;
}