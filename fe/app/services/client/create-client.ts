import { HTTPResponse, http } from "~/lib/http/http.server";
import { getSubdomain } from "~/lib/subdomain.server";
import { Client, CreateClient } from "~/types/client";
import { Token } from "~/types/token";

export const createClient = async (request: Request, token: Token, body: CreateClient) => {
  const subdomain = getSubdomain(request);
  const { data } = await http.post<HTTPResponse<Client>>(`company/${subdomain}/client`, body, {
    headers: { 'Authorization': `Bearer ${token.accessToken}`}
  });
  return data;
}