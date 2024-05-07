import { FetcherWithComponents, useActionData, useNavigation } from "@remix-run/react";
import { useEffect } from "react";
import { ActionResponse } from "~/types/action-response";
type Options<T> = {
  onSuccess?: (data?: T) => void;
  onError?: (errorMessage?: string) => void;
}
export const useActionCallback = <T = any>(fetcher?: FetcherWithComponents<any>, opt?: Options<T>) => {
  // default
  const navigation = useNavigation();
  const actionData = useActionData();

  useEffect(() => {
    if (!actionData) return;
    const { ok, data, error } = actionData as ActionResponse<T>;
    if (navigation.state === 'loading' && ok) {
      opt?.onSuccess?.(data);
    }
    if (navigation.state === 'loading' && !ok) {
      opt?.onError?.(error);
    }
  }, [navigation?.state, actionData]);

  // fetcher
  useEffect(() => {
    if (fetcher?.state === 'loading' && fetcher?.data?.ok) {
      opt?.onSuccess?.()
    }
    if (fetcher?.state === 'loading' && !fetcher?.data?.ok) {
      opt?.onError?.(fetcher?.data?.error)
    }
  }, [fetcher?.state, fetcher?.data]);
}