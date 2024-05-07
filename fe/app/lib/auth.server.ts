import { Token } from "~/types/token";
import { HTTPResponse, http } from "./http/http.server";
import { ApiError } from "~/errors/api-error";
import { SessionData, commitSession, destroySession, getSession } from "./session.server";
import { redirect } from "@remix-run/node";
import moment from "moment";

export const login = async (request: Request, account: string, password: string) => {
  const { data: res } = await http.post<HTTPResponse<Token>>('/auth/login', { account, password });
  
  if (!res.success) throw new ApiError(res.errorMessage, res.status);
  const session = await getSession(request);
  session.set(SessionData.ACCESS_TOKEN, res.data.accessToken);
  console.log(session.get(SessionData.ACCESS_TOKEN));
  session.set(SessionData.REFRESH_TOKEN, res.data.refreshToken);
  session.set(SessionData.EXPIRES_AT, moment().add(res.data.expiresIn, 'seconds').toDate());
  session.set(SessionData.EXPIRES_IN, res.data.expiresIn);
  session.set(SessionData.USER_ID, res.data.userId);
  session.set(SessionData.USER_TYPE, res.data.userType);
  
  if (res.data.userType === 'admin') {
    return redirect('/hub', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  } else {
    return redirect('/', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  }
  
}
export const createAccount = async (nick: string, email: string, password: string) => {
  const { data } = await http.post<HTTPResponse>('/auth/create', { nick, email, password });
  return data; 
}
export const activeAccount = async (token: string) => {
  const { data } = await http.get<HTTPResponse<boolean>>(`/auth/active?token=${token}`);
  return data;
}
export const forgotPassword = async (email: string) => {
  const { data } = await http.put<HTTPResponse<boolean>>(`/auth/forget-password`, { email });
  return data;
}
export const resetPassword = async (token: string, password: string) => {
  const { data } = await http.put<HTTPResponse<boolean>>(`/auth/reset-password?token=${token}`, { password });
  return data;
}
export type Authenticate = {
  logged: boolean;
  headers: Headers;
  token?: Token;
}
export const authenticate = async (request: Request, headers: Headers): Promise<Authenticate> => {
  const headersClone = new Headers(headers);
  const session = await getSession(request);
  
  if (!session.has(SessionData.ACCESS_TOKEN) && !session.has(SessionData.REFRESH_TOKEN)) {
    return { logged: false, headers: headersClone };
  }
  const expirationDate = session.get(SessionData.EXPIRES_AT) as string;
  // se o token expirou ou não tem token de acesso vai recarregar o token
  if (
    moment().isAfter(expirationDate) ||
    !session.get(SessionData.ACCESS_TOKEN)
  ) {
    console.log('refresh');
    
    const refreshResult = await refreshToken(session.get(SessionData.REFRESH_TOKEN));
    if (!refreshResult.success) {
      headersClone.append('Set-Cookie', await destroySession(session));
      return { logged: false, headers: headersClone };
    }
    
    session.set(SessionData.ACCESS_TOKEN, refreshResult.data.accessToken);
    session.set(SessionData.REFRESH_TOKEN, refreshResult.data.refreshToken);
    session.set(SessionData.EXPIRES_AT, moment().add(refreshResult.data.expiresIn, 'seconds').toDate());
    session.set(SessionData.EXPIRES_IN, refreshResult.data.expiresIn);
    session.set(SessionData.USER_ID, refreshResult.data.userId);
    session.set(SessionData.USER_TYPE, refreshResult.data.userType);
    
    headersClone.append('Set-Cookie', await commitSession(session));
    return { logged: true, headers: headersClone, token: refreshResult.data };
  }
  console.log('no refresh');

  return { 
    logged: true, 
    headers: headersClone, 
    token: {
      accessToken: session.get(SessionData.ACCESS_TOKEN),
      expiresIn: session.get(SessionData.EXPIRES_IN),
      refreshToken: session.get(SessionData.REFRESH_TOKEN),
      userType: session.get(SessionData.USER_TYPE),
      userId: session.get(SessionData.USER_ID),
    } 
  };
}
export const refreshToken = async (token: string) => {
  const { data } = await http.post<HTTPResponse<Token>>('/auth/refresh-token', { refreshToken: token });
  return data;
}
export const logout = async (request: Request) => {
  const session = await getSession(request);
  await destroySession(session);
  return redirect('/login');
}