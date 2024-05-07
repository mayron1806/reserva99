import { ClientLoaderFunctionArgs } from "@remix-run/react";
import { cacheClientLoader } from "remix-client-cache";

export const clientLoader = (args: ClientLoaderFunctionArgs) => cacheClientLoader(args, { key: '/admin/cashflow', type: 'swr' });
clientLoader.hydrate = true;