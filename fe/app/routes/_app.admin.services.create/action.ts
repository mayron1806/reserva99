import { withAuthAction } from "~/middlewares/with-auth-action";
import { CreateServiceSchema, createServiceSchema } from "./validation/create-service";
import { getValidatedFormData } from "remix-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { json } from "@remix-run/node";
import { unmaskMoney, unmaskTime } from "~/masks/unmask";
import { createService } from "~/services/service/create-service";
import { ActionResponse } from "~/types/action-response";
import { Service } from "~/types/service";

export const action = withAuthAction(async ({ request, token }) => {
  const { errors, data, receivedValues: defaultValues } =
  await getValidatedFormData<CreateServiceSchema>(request, zodResolver(createServiceSchema));
  if (errors) {
    return json({ errors, defaultValues });
  }
  
  const result = await createService(request, token, {
    name: data.name,
    containVariants: data.containVariants,
    description: data.description,
    duration: data.duration ? unmaskTime(data.duration) : undefined,
    identifier: data.identifier,
    price: data.price ? unmaskMoney(data.price) : undefined,
    variants: data.variants?.map(v => ({ ...v, price: unmaskMoney(v.price), duration: unmaskTime(v.duration) })),
  });
  if (!result.success) {
    return json({ ok: false, error: result.errorMessage } as ActionResponse);
  }
  return json({ ok: true, data: result.data} as ActionResponse<Service>);
});