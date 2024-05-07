import { json } from "@remix-run/node";
import { withAuthLoader } from "~/middlewares/with-auth-loader";
import { getTime } from "~/services/time/get-time";
import { WeekTime } from "~/types/time";
export type LoaderData = {
  weektimes: WeekTime
}
export const loader = withAuthLoader(async ({ request, token, headers }) => {
  const data = await getTime(request, token);
  if (!data.success) {
    throw json(data.errorMessage, { headers, status: data.status })
  }
  return json({ weektimes: data.data } as LoaderData, { headers });
})