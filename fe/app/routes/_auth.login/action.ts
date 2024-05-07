import { ActionFunctionArgs, json } from "@remix-run/node";
import { ApiError } from "~/errors/api-error";
import { login } from "~/lib/auth.server";
import { loginSchema } from "~/validations/login";

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.clone().formData();
  const account = form.get("account");
  const password = form.get("password");
  const validationResult = loginSchema.safeParse({ account, password });
  
  if (!validationResult.success) {
    return json({
      error: validationResult.error.errors[0].message,
    }, { status: 400 });
  }
  try {
    return await login(request, validationResult.data.account, validationResult.data.password);
  } catch(error) {
    if (error instanceof ApiError) {
      return json({ error: error.message }, { status: error.status });
    }
    return json({ error: (error as Error).message }, { status: 400 });
  }
}