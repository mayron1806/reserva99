import { json } from "@remix-run/node";
import { withAuthLoader } from "~/middlewares/with-auth-loader";
import { Address } from "~/types/address";
import { getCompanyByIdentifier } from "~/services/company/getc-company-by-identifier";
export type LoaderData = {
  id: string;
  name: string;
  description: string;
  identifier: string;
  address: Address;
}
export const loader = withAuthLoader(async ({ token, request, headers }) => {
  const response = await getCompanyByIdentifier(request, token);
  if (!response.success) {
    throw json(response.errorMessage, { status: response.status, headers });
  }
  return json(response.data, { headers });
});