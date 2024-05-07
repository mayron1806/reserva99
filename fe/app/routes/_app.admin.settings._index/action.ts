import { json } from "@remix-run/node";
import { withAuthAction } from "~/middlewares/with-auth-action";
import { LoaderData } from "./loader";
import { ActionResponse } from "~/types/action-response";
import { updateCompany } from "~/services/company/update-company";
import { getValidatedFormData } from "remix-hook-form";
import { EditCompanySchema, editCompanySchema } from "./validation/edit-company";
import { zodResolver } from "@hookform/resolvers/zod";

// atualizar dados da clinica
export const action = withAuthAction(async ({ request, token }) => {
  const { errors, data, receivedValues: defaultValues } =
    await getValidatedFormData<EditCompanySchema>(request, zodResolver(editCompanySchema));
  if (errors) {
    return json({ errors, defaultValues });
  }
  const response = await updateCompany(request, token, data);
  if (!response.success) {
    return json({ error: response.errorMessage, ok: false } as ActionResponse<LoaderData>);
  }
  return json({ ok: true });
});