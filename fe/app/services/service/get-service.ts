import { HTTPResponse, http } from "~/lib/http/http.server";
import { getSubdomain } from "~/lib/subdomain.server";
import { Service } from "~/types/service";
import { Token } from "~/types/token";

export const getService = async (request: Request, token: Token) => {
  const subdomain = getSubdomain(request);
  const { data } = await http.get<HTTPResponse<Service[]>>(`/company/${subdomain}/service`, {
    headers: { 'Authorization': `Bearer ${token.accessToken}`}
  });
  return data;
}