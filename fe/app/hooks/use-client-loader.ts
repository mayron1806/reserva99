import { useRouteLoaderData } from '@remix-run/react';
import useSWRMutation from 'swr/mutation';
import { LoaderData, loader } from '~/routes/_app.admin/loader';
type Arg<Rest> = Rest & {
  accessToken: string;
  subdomain: string;
}
type Fetcher<Params, Res> = (url: string, { arg }: { arg: Arg<Params> }) => Promise<Res>;
export const useClientLoader = <Params, Res>(url: string, fetcher: Fetcher<Params, Res>) => {
  const { accessToken, subdomain }: LoaderData = useRouteLoaderData<typeof loader>('routes/_app.admin');
  const { data, trigger, isMutating } = useSWRMutation(
    url, 
    (url, { arg }: { arg: any }) => fetcher(url, { arg: { ...arg, accessToken, subdomain }})
  );
  return { data, trigger, isLoading: isMutating };
}
