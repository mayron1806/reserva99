import { json } from "@remix-run/node";
import moment from "moment";
import { withAuthLoader } from "~/middlewares/with-auth-loader";
import { getReservesByMonth } from "~/services/reserve/get-reserves-by-month";
import { getTime } from "~/services/time/get-time";
import { ReserveItem } from "~/types/schedule";
import { WeekTime } from "~/types/time";
export type LoaderData = {
  reserves: ReserveItem[];
  time: WeekTime;
}
export const loader = withAuthLoader(async ({ request, token, headers }) => {
  const url = new URL(request.url);
  const searchParamsDate = url.searchParams.get("date");
  const date = moment(searchParamsDate ?? moment());
  const month = date.month();
  const year = date.year();
  const reserveData = await getReservesByMonth(request, token, month, year);
  if (!reserveData.success) {
    throw json(reserveData.errorMessage, { headers, status: reserveData.status });
  }
  const timeData = await getTime(request, token);
  if (!timeData.success) {
    throw json(timeData.errorMessage, { headers, status: timeData.status });
  }
  return json({ 
    reserves: reserveData.data, 
    time: timeData.data,
   } as LoaderData, { headers });
});