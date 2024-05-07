import { HTTPResponse, http } from "~/lib/http";
import { getSubdomain } from "~/lib/subdomain.server";
import { WeekTime } from "~/types/time";
import { Token } from "~/types/token";

export const getTime = async (request: Request, token: Token) => {
  const subdomain = getSubdomain(request);
  const { data } = await http.get<HTTPResponse<WeekTime>>(`/company/${subdomain}/time`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return data;

}