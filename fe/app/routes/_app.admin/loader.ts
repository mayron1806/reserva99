import { json } from "@remix-run/node";
import { getSubdomain } from "~/lib/subdomain.server";
import { withAuthLoader } from "~/middlewares/with-auth-loader";
export type LoaderData = {
  accessToken: string;
  subdomain: string;
}
export const loader = withAuthLoader(async ({ request, headers, token }) => {
  const subdomain = getSubdomain(request);
  const { accessToken } = token;
  return json({ accessToken, subdomain } as LoaderData, { headers });
});