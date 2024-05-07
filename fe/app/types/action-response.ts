export type ActionResponse<T = undefined> = {
  error?: string;
  data?: T;
  ok: boolean;
}