import "dotenv/config";
import z from "zod";
const schema = z.object({
  SERVER_URL: z.string().url(),
  PUBLIC_SERVER_URL: z.string().url(),
  DOMAIN: z.string(),
  COOKIE_DOMAIN: z.string().min(1),
  COOKIE_SESSION_SECRET: z.string().min(1),
  NODE_ENV: z.string().min(1),
  SSL_ENABLED: z.string().transform(v => v === 'true'),
});
type ENV = z.infer<typeof schema>;

declare global {
  var ENV: ENV;
  interface Window {
    ENV: {
      NODE_ENV: string
      PUBLIC_SERVER_URL: string
    }
  }
};

export const getEnv = () => {
  return schema.parse({
    ...process.env,
  });
}