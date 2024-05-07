import axios, { AxiosError, AxiosResponse } from "axios";
interface SuccessResponse<T> {
  status: number;
  data: T;
  success: true;
}
interface ErrorResponse {
  status: number;
  errorMessage: string;
  success: false;
}
export type HTTPResponse<T = undefined> = SuccessResponse<T> | ErrorResponse;
const http = axios.create({
  baseURL: ENV.SERVER_URL,
});
http.interceptors.response.use((res) => {
  const data = res.data;
  return { 
    ...res,
    data: { 
      data, 
      status: res.status,
      success: true,
    } as HTTPResponse<typeof data>
 };
}, (error) => {
  if (error instanceof AxiosError) {
    if (error.code === 'ECONNREFUSED') {
      return { 
        ...error.response,
        data: {
          status: 500,
          success: false,
          errorMessage: 'Ocorreu um erro ao conectar no servidor, tente novamente mais tarde',
        } as HTTPResponse
      } as AxiosResponse<any, any>;
    }
    return { 
      ...error.response,
      data: {
        status: error.response?.status,
        success: false,
        errorMessage: Array.isArray(error.response?.data.message) ? error.response?.data.message[0] : error.response?.data.message,
      } as HTTPResponse
    } as AxiosResponse<any, any>;
  }
  return Promise.reject(error);
})
export { http }
