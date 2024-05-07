import { Outlet } from "@remix-run/react";
import { loader } from "./loader";
import Topbar from "~/components/top-bar";
import ErrorBoundary from "./error";

const AppLayout = () => {
  return ( 
    <div className="min-h-screen flex flex-col flex-1">
      <Topbar />
      <Outlet />
    </div>
  );
}
export { loader, ErrorBoundary };
 
export default AppLayout;