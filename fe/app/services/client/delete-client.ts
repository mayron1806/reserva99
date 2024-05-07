import { HTTPResponse, http } from "~/lib/http/http.server";
import { getSubdomain } from "~/lib/subdomain.server";
import { Client } from "~/types/client";
import { Token } from "~/types/token";

export const deleteClient = async (request: Request, token: Token, clientId: string) => {
  const subdomain = getSubdomain(request);
  const { data } = await http.delete<HTTPResponse<Client>>(`/company/${subdomain}/client/${clientId}`, {
    headers: { 'Authorization': `Bearer ${token.accessToken}`}
  });
  return data;
}