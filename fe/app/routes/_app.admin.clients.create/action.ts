import { withAuthAction } from "~/middlewares/with-auth-action";
import { getValidatedFormData } from "remix-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { json } from "@remix-run/node";
import { ActionResponse } from "~/types/action-response";
import { CreateClientSchema, createClientSchema } from "./validation/create-client";
import { createClient } from "~/services/client/create-client";
import { Client } from "~/types/client";

export const action = withAuthAction(async ({ request, token }) => {
  const { errors, data, receivedValues: defaultValues } =
  await getValidatedFormData<CreateClientSchema>(request, zodResolver(createClientSchema));
  if (errors) {
    return json({ errors, defaultValues });
  }
  const result = await createClient(request, token, {
    name: data.name,
    alias: data.alias,
    email: data.email,
    phone: `+55 ${data.phone}`,
  });
  if (!result.success) {
    return json({ ok: false, error: result.errorMessage } as ActionResponse);
  }
  return json({ ok: true, data: result.data} as ActionResponse<Client>);
});