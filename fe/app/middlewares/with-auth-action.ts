import { ActionFunction, ActionFunctionArgs, redirect } from "@remix-run/node";
import { authenticate } from "~/lib/auth.server";
import { Token } from "~/types/token";

type AuthActionFuncitionArgs = ActionFunctionArgs & { token: Token };
type AuthActionFuncition = (args: AuthActionFuncitionArgs) => ReturnType<ActionFunction>;

export const withAuthAction = (action: AuthActionFuncition) => async (args: ActionFunctionArgs) => {
  const auth = await authenticate(args.request, new Headers());
  if (auth.logged && auth.token) {
    return await action({...args, token: auth.token });
  } else {
    return redirect('/login', {
      headers: auth.headers,
    });
  }
};