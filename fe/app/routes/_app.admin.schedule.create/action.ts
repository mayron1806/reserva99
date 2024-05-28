import { zodResolver } from "@hookform/resolvers/zod";
import { json } from "@remix-run/node";
import { getValidatedFormData } from "remix-hook-form";
import { withAuthAction } from "~/middlewares/with-auth-action";
import { createReserve } from "~/services/reserve/create-reserve";
import { CreateScheduleSchema, createScheduleSchema } from "./validation/create-schedule";
import moment from "moment";
import { ActionResponse } from "~/types/action-response";
import { Reserve } from "~/types/schedule";

export const action = withAuthAction(async ({ request, token }) => {
  const { errors, data, receivedValues: defaultValues } =
  await getValidatedFormData<CreateScheduleSchema>(request, zodResolver(createScheduleSchema));
  if (errors) {
    return json({ errors, defaultValues });
  }
  const result = await createReserve(request, token, {
    date: moment(data.date).toDate(),
    serviceId: data.serviceId,
    variantId: data.variantId,
    paymentStatus: data.paymentStatus,
    client: data.client ? {
      name: data.client.name,
      alias: data.client.alias,
      email: data.client.email,
      phone: data.client.phone,
    } : undefined,
    clientId: data.clientId,
  });
  if (!result.success) {
    return json({ ok: false, error: result.errorMessage } as ActionResponse);
  }
  return json({ ok: true, data: result.data} as ActionResponse<Reserve>);
});