import { json } from "@remix-run/node";
import { withAuthLoader } from "~/middlewares/with-auth-loader";
import { HTTPResponse, http } from "~/lib/http/http.server";
import { CompanyList } from "~/types/company";

export type LoaderData = {
  ok: boolean;
  errorMessage?: string;
  companies?: CompanyList;
}
export const loader = withAuthLoader(async ({ token, headers }) => {
  const { data } = await http.get<HTTPResponse<CompanyList>>('/company', {
    headers: { 'Authorization': `Bearer ${token.accessToken}` }
  });
  if (!data.success) {
    throw json(data.errorMessage, { status: data.status, headers });
  }  
  return json({ companies: data.data, ok: true } as LoaderData, { headers });
});