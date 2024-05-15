import { createCookieSessionStorage } from "@remix-run/node";


export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    sameSite: "lax", 
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    secrets: [ENV.COOKIE_SESSION_SECRET],
    domain: ENV.COOKIE_DOMAIN,
    secure: ENV.SSL_ENABLED,
  },
});
export enum SessionData {
  ACCESS_TOKEN = "accessToken",
  REFRESH_TOKEN = "refreshToken",
  EXPIRES_IN = "expiresIn",
  EXPIRES_AT = "expiresAt",
  USER_ID = "userId",
  USER_TYPE = "userType",
};
export const getSession = async (request: Request) => {
  return await sessionStorage.getSession(request.headers.get('Cookie'));
}
export const { commitSession, destroySession } = sessionStorage;