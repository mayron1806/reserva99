
export const fetcher: typeof fetch = (...args) => fetch(...args).then((res: Response) => res.json());
