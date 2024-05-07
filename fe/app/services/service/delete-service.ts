import { HTTPResponse, http } from "~/lib/http/http.server";
import { getSubdomain } from "~/lib/subdomain.server";
import { Service } from "~/types/service";
import { Token } from "~/types/token";

export const deleteService = async (request: Request, token: Token, serviceId: string) => {
  const subdomain = getSubdomain(request);
  const { data } = await http.delete<HTTPResponse<Service>>(`/company/${subdomain}/service/${serviceId}`, {
    headers: { 'Authorization': `Bearer ${token.accessToken}`}
  });
  return data;
}