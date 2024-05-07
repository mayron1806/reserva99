import { HTTPResponse, http } from "~/lib/http/http.server";
import { getSubdomain } from "~/lib/subdomain.server";
import { Transaction, CreateTransaction  } from "~/types/cashflow/transaction";
import { Token } from "~/types/token";

export const createTransaction = async (request: Request, token: Token, body: CreateTransaction) => {
  const subdomain = getSubdomain(request);
  const { data } = await http.post<HTTPResponse<Transaction>>(`/company/${subdomain}/cashflow/transaction`, body, {
    headers: { 'Authorization': `Bearer ${token.accessToken}` }
  });
  return data;
}
