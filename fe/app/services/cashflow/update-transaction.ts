import { HTTPResponse, http } from "~/lib/http/http.server";
import { getSubdomain } from "~/lib/subdomain.server";
import { Transaction, UpdateTransaction  } from "~/types/cashflow/transaction";
import { Token } from "~/types/token";

export const updateTransaction = async (request: Request, token: Token, body: UpdateTransaction) => {
  const subdomain = getSubdomain(request);
  const { data } = await http.patch<HTTPResponse<Transaction>>(`/company/${subdomain}/cashflow/transaction/${body.id}`, body, {
    headers: { 'Authorization': `Bearer ${token.accessToken}` }
  });
  return data;
}
