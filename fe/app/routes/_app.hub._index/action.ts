import { zodResolver } from "@hookform/resolvers/zod";
import { json, redirect } from "@remix-run/node";
import { getValidatedFormData } from "remix-hook-form";
import { withAuthAction } from "~/middlewares/with-auth-action";
import { CreateCompanySchema, createCompanySchema } from "./validation/create-company";
import { HTTPResponse, http } from "~/lib/http/http.server";
import { ActionResponse } from "~/types/action-response";
import { Company } from "~/types/company";

export const action = withAuthAction(async ({ request, token }) => {
  const { errors, data, receivedValues: defaultValues } =
    await getValidatedFormData<CreateCompanySchema>(request, zodResolver(createCompanySchema));
  if (errors) {
    return json({ errors, defaultValues });
  }
  const { data: response } = await http.post<HTTPResponse<Company>>('/company', {
    ...data,
    address: data.hideAddress ? undefined : data.address,
  } as Omit<Company, 'id'>, {
    headers: { 'Authorization': `Bearer ${token.accessToken}`}
  });
  if (!response.success) {
    return json({ ok: false, error: response.errorMessage } as ActionResponse<Company>)
  }
  return json({ ok: true, data: response.data } as ActionResponse<Company>)
});