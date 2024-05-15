import moment from "moment";
import { ApiError } from "~/errors/api-error";
import { useClientLoader } from "~/hooks/use-client-loader";
import { HTTPResponse, http } from "~/lib/http/http.client";
import { TimeAvailability } from "~/types/availability";

type ArgsExtras = { date: string, serviceId: string, variantId?: string };
export const useTimeLoader = ({ date, serviceId, variantId }: ArgsExtras) => {
  return useClientLoader<ArgsExtras, TimeAvailability[]>(`/reserve/availability?date=${date}&serviceId=${serviceId}&variantId=${variantId}`,
    async (url, { arg }) => {
      const baseUrl = window.ENV.PUBLIC_SERVER_URL;
      const isoDate = moment(arg.date).toISOString();
      const requestUrl = new URL(`${baseUrl}/company/${arg.subdomain}/reserve/availability?date=${isoDate}`);
      if (arg.serviceId) requestUrl.searchParams.append('serviceId', arg.serviceId);
      if (arg.variantId) requestUrl.searchParams.append('variantId', arg.variantId);
    
      const { data } = await http.get<HTTPResponse<TimeAvailability[]>>(requestUrl.toString(), {
        headers: { 'Authorization': `Bearer ${arg.accessToken}` }
      });
      if (!data.success) throw new ApiError(data.errorMessage, data.status);
      return data.data;
    }
  );
}