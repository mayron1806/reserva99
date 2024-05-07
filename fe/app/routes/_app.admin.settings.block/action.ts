import { getValidatedFormData } from "remix-hook-form";
import { withAuthAction } from "~/middlewares/with-auth-action";
import { CreateOrUpdateTimeSchema, createOrUpdateTimeSchema } from "./validation/create-or-update-time";
import { zodResolver } from "@hookform/resolvers/zod";
import { json } from "@remix-run/node";
import { createOrUpdateTime } from "~/services/time/create-or-update-time";
import { WeekTime } from "~/types/time";
import { ActionResponse } from "~/types/action-response";

export const action = withAuthAction(async ({ request, token }) => {
  const { errors, data, receivedValues: defaultValues } =
  await getValidatedFormData<CreateOrUpdateTimeSchema>(request, zodResolver(createOrUpdateTimeSchema));
  if (errors) {
    return json({ errors, defaultValues });
  }
  console.log(data);
  const result = await createOrUpdateTime(request, token, data as WeekTime);
  if (!result.success) {
    return json({ error: result.errorMessage, ok: false } as ActionResponse, { status: result.status });
  }
  return json({ data: result.data, ok: true } as ActionResponse<WeekTime>);
});