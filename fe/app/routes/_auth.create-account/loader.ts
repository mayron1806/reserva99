import { LoaderFunction, json, redirect } from "@remix-run/node"
import { authenticate } from "~/lib/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const { headers, logged } = await authenticate(request, new Headers());
  if (logged) {
    return redirect('/', {
      headers,
    });
  }
  return json(null, {
    headers
  });
}