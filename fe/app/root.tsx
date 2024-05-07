import { LinksFunction, json } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from "@remix-run/react";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import stylesheet from "~/tailwind.css?url";
import { Toaster } from "./components/ui/toaster";
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];
export async function loader() {
  return json({
    ENV: {
      NODE_ENV: ENV?.NODE_ENV,
      DOMAIN: ENV?.DOMAIN,
      SERVER_URL: ENV?.SERVER_URL
    },
  });
}
export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData<typeof loader>("root");
  return (
    <html lang="pt-br">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Toaster />
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(
              data?.ENV
            )}`,
          }}
        />
        <Scripts />
      </body>
    </html>
  );
}
export const shouldRevalidate = () => false;
export default function App() {
  return <Outlet />;
}
