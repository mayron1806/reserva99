import { ApiError } from "~/errors/api-error";
import { useClientLoader } from "~/hooks/use-client-loader";
import { HTTPResponse, http } from "~/lib/http";
import { Service } from "~/types/service";

export const useServiceLoader = (serviceId?: string) => {
  return useClientLoader<{id: string}, Service>(`/service/${serviceId}`,
    async (url, { arg }) => {
      const baseUrl = window.ENV.SERVER_URL;
      const requestUrl = `${baseUrl}/company/${arg.subdomain}/service/${arg.id}`;
      const { data } = await http.get<HTTPResponse<Service>>(requestUrl, {
        headers: { 'Authorization': `Bearer ${arg.accessToken}` }
      });
      if (!data.success) throw new ApiError(data.errorMessage, data.status);
      return data.data;
    }
  );
}