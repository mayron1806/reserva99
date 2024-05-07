import { HTTPResponse, http } from "~/lib/http/http.server";
import { getSubdomain } from "~/lib/subdomain.server";
import { UpdateTransaction  } from "~/types/cashflow/transaction";
import { Token } from "~/types/token";

export const deleteTransaction = async (request: Request, token: Token, transactionId: string) => {
  const subdomain = getSubdomain(request);
  const { data } = await http.delete<HTTPResponse<{success: boolean}>>(`/company/${subdomain}/cashflow/transaction/${transactionId}`, {
    headers: { 'Authorization': `Bearer ${token.accessToken}` }
  });
  return data;
}
