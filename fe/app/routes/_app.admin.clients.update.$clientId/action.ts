import { withAuthAction } from "~/middlewares/with-auth-action";
import { getValidatedFormData } from "remix-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { json } from "@remix-run/node";
import { ActionResponse } from "~/types/action-response";
import { Service } from "~/types/service";
import { Token } from "~/types/token";
import { Params } from "@remix-run/react";
import { UpdateClientSchema, updateClientSchema } from "./validation/update-client";
import { updateClient } from "~/services/client/update-client";
import { deleteClient } from "~/services/client/delete-client";

export const action = withAuthAction(async ({ request, token, params }) => {
  if (!params.clientId) {
    return json({ ok: false, error: 'Id do cliente inválido ou ausente.' } as ActionResponse);
  }
  switch(request.method) {
    case 'POST':
      return await updateClientAction(request, token, params);
    case 'DELETE':
      return await deleteClientAction(request, token, params);
  }
});

const updateClientAction = async (request: Request, token: Token, params: Params<string>) => {
  const { errors, data, receivedValues: defaultValues } =
  await getValidatedFormData<UpdateClientSchema>(request, zodResolver(updateClientSchema));
  if (errors) {
    return json({ errors, defaultValues });
  }
  const result = await updateClient(request, token, {
    name: data.name,
    alias: data.alias,
    email: !!data.email ? data.email : undefined,
    phone: !!data.phone ? `+55 ${data.phone}` : undefined,
  }, params.clientId!);
  if (!result.success) {
    return json({ ok: false, error: result.errorMessage } as ActionResponse);
  }
  return json({ ok: true, data: result.data} as ActionResponse<Service>);
}
const deleteClientAction = async (request: Request, token: Token, params: Params<string>) => {
  const data = await deleteClient(request, token, params.clientId!);
  if (!data.success) {
    return json({ ok: false, error: data.errorMessage } as ActionResponse);
  }
  return json({ ok: true } as ActionResponse);
}