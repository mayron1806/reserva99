import { withAuthAction } from "~/middlewares/with-auth-action";
import { UpdateServiceSchema, updateServiceSchema } from "./validation/update-service";
import { getValidatedFormData } from "remix-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { json } from "@remix-run/node";
import { unmaskMoney, unmaskTime } from "~/masks/unmask";
import { ActionResponse } from "~/types/action-response";
import { Service } from "~/types/service";
import { updateService } from "~/services/service/update-service";
import { Token } from "~/types/token";
import { Params } from "@remix-run/react";
import { deleteService } from "~/services/service/delete-service";

export const action = withAuthAction(async ({ request, token, params }) => {
  switch(request.method) {
    case 'POST':
      return await updateServiceAction(request, token, params);
    case 'DELETE':
      return await deleteServiceAction(request, token, params);
  }
});

const updateServiceAction = async (request: Request, token: Token, params: Params<string>) => {
  if (!params.serviceId) {
    return json({ ok: false, error: 'Id do serviço inválido ou ausente.' } as ActionResponse);
  }
  const { errors, data, receivedValues: defaultValues } =
  await getValidatedFormData<UpdateServiceSchema>(request, zodResolver(updateServiceSchema));
  if (errors) {
    return json({ errors, defaultValues });
  }
  const result = await updateService(request, token, {
    name: data.name,
    containVariants: data.containVariants,
    description: data.description,
    duration: data.duration ? unmaskTime(data.duration) : undefined,
    identifier: data.identifier,
    price: data.price ? unmaskMoney(data.price) : undefined,
    allowClientReserve: data.allowClientReserve,
    variants: data.variants?.map(v => ({ ...v, price: unmaskMoney(v.price), duration: unmaskTime(v.duration) })),
  }, params.serviceId);
  if (!result.success) {
    return json({ ok: false, error: result.errorMessage } as ActionResponse);
  }
  return json({ ok: true, data: result.data} as ActionResponse<Service>);
}
const deleteServiceAction = async (request: Request, token: Token, params: Params<string>) => {
  if (!params.serviceId) {
    return json({ ok: false, error: 'Id do serviço inválido ou ausente.' } as ActionResponse);
  }
  const data = await deleteService(request, token, params.serviceId);
  if (!data.success) {
    return json({ ok: false, error: data.errorMessage } as ActionResponse);
  }
  return json({ ok: true } as ActionResponse);
}