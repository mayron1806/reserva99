import { ClientLoaderFunctionArgs } from "@remix-run/react";
import { cacheClientLoader } from "remix-client-cache";

export const clientLoader = (args: ClientLoaderFunctionArgs) => cacheClientLoader(args, { type: 'swr' });
clientLoader.hydrate = true;