import { LoaderFunction, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { authenticate } from "~/lib/auth.server";
import { getSubdomain } from "~/lib/subdomain.server";
import { Token } from "~/types/token";

export type AuthLoaderFuncitionArgs = LoaderFunctionArgs & { token: Token, headers: Headers };
export type AuthLoaderFuncition = (args: AuthLoaderFuncitionArgs) => ReturnType<LoaderFunction>;

export const withAuthLoader = (loader: AuthLoaderFuncition) => async (args: LoaderFunctionArgs) => {
  const sslEnabled = ENV.SSL_ENABLED;
  const {
    headers, logged, token
  } = await authenticate(args.request, new Headers());
  if (logged && token) {
    if (token.userType !== 'admin' && token.userType !== 'both') {
      return redirect('/', {
        headers,
      });
    }
    const subdomain = getSubdomain(args.request);
    const path = new URL(args.request.url).pathname;
    // se esta em uma url de companhia com subdominio
    // ex: clinica.exampe.com/hub
    // deve redirecionar para o root example.com/hub 
    if (path === '/hub' && subdomain) {
      return redirect(`${sslEnabled ? 'https' : 'http'}://${ENV.DOMAIN}/hub`, {
        headers,
      });
    }
    if (path !== '/hub') {
      if (!subdomain) {
        return redirect(`${sslEnabled ? 'https' : 'http'}://${ENV.DOMAIN}/hub`, {
          headers,
        });
      }
    }
    return await loader({...args, token: token, headers });
  } else {
    return redirect('/login', {
      headers,
    });
  }
};