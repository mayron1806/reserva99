import { HTTPResponse, http } from "~/lib/http/http.server";
import { getSubdomain } from "~/lib/subdomain.server";
import { Client, CreateClient } from "~/types/client";
import { Token } from "~/types/token";

export const updateClient = async (request: Request, token: Token, body: CreateClient, id: string) => {
  const subdomain = getSubdomain(request);
  const { data } = await http.patch<HTTPResponse<Client>>(`company/${subdomain}/client/${id}`, body, {
    headers: { 'Authorization': `Bearer ${token.accessToken}`}
  });
  return data;
}