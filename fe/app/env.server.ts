import "dotenv/config";
import * as z from "zod";
const schema = z.object({
  SERVER_URL: z.string().url(),
  COOKIE_DOMAIN: z.string().min(1),
  DOMAIN: z.string().min(1),
  COOKIE_SESSION_SECRET: z.string().min(1),
  COOKIE_SECURE: z.string().transform((a) => a === 'true'),
  SSL_ENABLED: z.string().transform((a) => a === 'true'),
  NODE_ENV: z.string().min(1),
});
type ENV = z.infer<typeof schema>;

declare global {
  var ENV: ENV;
};

export const getEnv = () => {
  return schema.parse(process.env);
}