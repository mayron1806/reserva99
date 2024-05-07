import { HTTPResponse, http } from "~/lib/http/http.server";
import { getSubdomain } from "~/lib/subdomain.server";
import { Company } from "~/types/company";
import { Token } from "~/types/token";

export const getCompanyByIdentifier = async (request: Request, token: Token) => {
  const subdomain = getSubdomain(request);
  const { data } = await http.get<HTTPResponse<Company>>(`/company/${subdomain}`, {
    headers: { 'Authorization': `Bearer ${token.accessToken}` },
  });
  return data;
}