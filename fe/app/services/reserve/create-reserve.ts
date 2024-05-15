import { HTTPResponse, http } from "~/lib/http/http.server";
import { getSubdomain } from "~/lib/subdomain.server";
import { CreateReserve, Reserve } from "~/types/schedule";
import { Token } from "~/types/token";

export const createReserve = async (request: Request, token: Token, body: CreateReserve) => {
  const subdomain = getSubdomain(request);
  const { data } = await http.post<HTTPResponse<Reserve>>(`/company/${subdomain}/reserve`, body, {
    headers: { 'Authorization': `Bearer ${token.accessToken}`},
  });
  return data;
}