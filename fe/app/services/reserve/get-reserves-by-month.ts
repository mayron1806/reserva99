import { HTTPResponse, http } from "~/lib/http/http.server";
import { getSubdomain } from "~/lib/subdomain.server";
import { ReserveItem } from "~/types/schedule";
import { Token } from "~/types/token";

export const getReservesByMonth = async (request: Request, token: Token, month: number, year: number) => {
  const subdomain = getSubdomain(request);
  const { data } = await http.get<HTTPResponse<ReserveItem[]>>(`/company/${subdomain}/reserve?month=${month}&year=${year}`, {
    headers: { 'Authorization': `Bearer ${token.accessToken}`}
  });
  return data;
}