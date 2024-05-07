import { HTTPResponse, http } from "~/lib/http/http.server";
import { getSubdomain } from "~/lib/subdomain.server";
import { CreateService, Service } from "~/types/service";
import { Token } from "~/types/token";

export const createService = async (request: Request, token: Token, body: CreateService) => {
  const subdomain = await getSubdomain(request);
  const { data } = await http.post<HTTPResponse<Service>>(`company/${subdomain}/service`, body, {
    headers: { 'Authorization': `Bearer ${token.accessToken}`}
  });
  return data;
}