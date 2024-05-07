import { HTTPResponse, http } from "~/lib/http/http.server";
import { getSubdomain } from "~/lib/subdomain.server";
import { Company } from "~/types/company";
import { Token } from "~/types/token";

export const updateCompany = async (request: Request, token: Token, body: unknown) => {
  const subdomain = getSubdomain(request);
  const { data } = await http.patch<HTTPResponse<Company>>(`/company/${subdomain}`, body, {
    headers: { 'Authorization': `Bearer ${token.accessToken}`}
  });
  return data;
}