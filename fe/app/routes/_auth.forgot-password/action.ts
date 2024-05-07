import { ActionFunctionArgs, json } from "@remix-run/node";
import { getValidatedFormData } from "remix-hook-form";
import { forgotPassword } from "~/lib/auth.server";
import { ForgotPasswordSchema, forgotPasswordSchema } from "./validation/forgot-password-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionResponse } from "~/types/action-response";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { errors, data, receivedValues: defaultValues } =
    await getValidatedFormData<ForgotPasswordSchema>(request, zodResolver(forgotPasswordSchema));
  if (errors) {
    return json({ errors, defaultValues });
  }
  const res = await forgotPassword(data.email);
  if (!res.success) {
    return json({ error: res.errorMessage, ok: false } as ActionResponse);
  }
  return json({ ok: true } as ActionResponse);
}