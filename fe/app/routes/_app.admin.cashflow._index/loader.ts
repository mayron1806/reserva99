import { LoaderFunction, json, redirect } from "@remix-run/node";
import moment from "moment";
import { withAuthLoader } from "~/middlewares/with-auth-loader";
import { getCashFlow } from "~/services/cashflow/get-cashflow";

export const loader: LoaderFunction = withAuthLoader(async ({ request, token, headers }) => {
  const url = new URL(request.url);
  let start = url.searchParams.get('start');
  let end = url.searchParams.get('end');
  if (!start || !end) {
    start = moment().startOf('month').format('YYYY-MM-DD');
    end = moment().endOf('month').format('YYYY-MM-DD');
    return redirect(`?start=${start}&end=${end}`, { headers });
  }
  if (!start) start = moment().subtract(1, 'month').format('YYYY-MM-DD');
  if (!end) end = moment().format('YYYY-MM-DD');
  const data = await getCashFlow(request, token, start, end);
  
  if (!data.success) {
    throw json(data.errorMessage, { headers, status: data.status });
  }
  return json(data.data, { headers });
})