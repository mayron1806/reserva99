import { ActionFunctionArgs, json } from "@remix-run/node";
import { getValidatedFormData } from "remix-hook-form";
import { createAccount } from "~/lib/auth.server";
import { CreateUserSchema, createUserSchema } from "./validation/create-account-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionResponse } from "~/types/action-response";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { errors, data, receivedValues: defaultValues } =
    await getValidatedFormData<CreateUserSchema>(request, zodResolver(createUserSchema));
  if (errors) {
    return json({ errors, defaultValues });
  }
  const res = await createAccount(data.nick, data.email, data.password);
  if (!res.success) {
    return json({ error: res.errorMessage, ok: false } as ActionResponse);
  }
  return json({ ok: true } as ActionResponse);
}