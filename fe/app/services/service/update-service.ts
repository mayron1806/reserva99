import { HTTPResponse, http } from "~/lib/http/http.server";
import { getSubdomain } from "~/lib/subdomain.server";
import { CreateService, Service } from "~/types/service";
import { Token } from "~/types/token";

export const updateService = async (request: Request, token: Token, body: CreateService, id: string) => {
  const subdomain = getSubdomain(request);
  const { data } = await http.put<HTTPResponse<Service>>(`company/${subdomain}/service/${id}`, body, {
    headers: { 'Authorization': `Bearer ${token.accessToken}`}
  });
  return data;
}