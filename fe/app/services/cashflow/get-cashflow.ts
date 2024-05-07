import { HTTPResponse, http } from "~/lib/http/http.server";
import { getSubdomain } from "~/lib/subdomain.server";
import { GetCashflow } from "~/types/cashflow/cashflow";
import { Token } from "~/types/token";
export const getCashFlow = async (request: Request, token: Token, start: string, end: string) => {
  const subdomain = getSubdomain(request);
  const { data } = await http.get<HTTPResponse<GetCashflow[]>>(`company/${subdomain}/cashflow?start=${start}&end=${end}`, {
    headers: { 'Authorization': `Bearer ${token.accessToken}`}
  });
  return data;
}