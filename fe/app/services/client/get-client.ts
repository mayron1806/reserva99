import { HTTPResponse, http } from "~/lib/http/http.server";
import { getSubdomain } from "~/lib/subdomain.server";
import { Client } from "~/types/client";
import { Token } from "~/types/token";

export const getClient = async (request: Request, token: Token, filter?: string) => {
  const query = filter && filter.length > 0 ? `?filter=${filter}` : '';
  const subdomain = getSubdomain(request);
  const { data } = await http.get<HTTPResponse<Client[]>>(`/company/${subdomain}/client${query}`, {
    headers: { 'Authorization': `Bearer ${token.accessToken}`}
  });
  return data;
}