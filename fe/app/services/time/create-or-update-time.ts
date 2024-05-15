import { HTTPResponse, http } from "~/lib/http/http.server";
import { getSubdomain } from "~/lib/subdomain.server";
import { WeekTime } from "~/types/time";
import { Token } from "~/types/token";

export const createOrUpdateTime = async (request: Request, token: Token, body: WeekTime) => {
  const subdomain = getSubdomain(request);
  const { data } = await http.post<HTTPResponse<WeekTime>>(`company/${subdomain}/time`, body, {
    headers: {
      'Authorization': `Bearer ${token.accessToken}`,
    }
  });
  return data;
}