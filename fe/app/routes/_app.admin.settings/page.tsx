import { Outlet, useLocation } from "@remix-run/react";
import { twMerge } from "tailwind-merge";

const SettingsPage = () => {
  
  return ( 
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Configurações</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav
          className="grid gap-4 text-sm text-muted-foreground" x-chunk="dashboard-04-chunk-0"
        >
          <MenuItem href="/admin/settings">Geral</MenuItem>
          <MenuItem  href="/admin/settings/times">Horários de funcionamento</MenuItem>
          {/* <MenuItem  href="/admin/settings/block">Bloqueio de datas</MenuItem>
          <MenuItem  href="/admin/settings/billing">Cobrança</MenuItem>
          <MenuItem  href="/admin/settings/support">Suporte</MenuItem>
          <MenuItem warn href="/admin/settings/danger-zone">Zona de perigo</MenuItem> */}
        </nav>
        <div className="grid gap-6">
         <Outlet />
        </div>
      </div>
    </main>
  );
}
type MenuItemProps = {
  href: string;
  children: React.ReactNode;
  warn?: boolean;
}
const MenuItem = ({ href, children, warn }: MenuItemProps) => {
  const location = useLocation();
  const isSelected = location.pathname === href || location.pathname === `${location.pathname}/`;
  return (
    <a href={href} className={twMerge(isSelected && 'font-semibold text-primary',isSelected && warn && 'text-destructive')}>{children}</a>
  )
}
export default SettingsPage;