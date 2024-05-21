import { CircleUser, Menu, Package2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import React from "react";
import { twMerge } from "tailwind-merge";
import { useLocation, useNavigate } from "@remix-run/react";
type MenuItemProps = {
  href: string;
  children: React.ReactNode;
}
const MenuItem = ({ href, children }: MenuItemProps) => {
  const location = useLocation();
  const isSelected = location.pathname === href || location.pathname === `${location.pathname}/`;
  return (
    <a
      href={href}
      className={twMerge('text-muted-foreground transition-colors text-nowrap hover:text-primary', isSelected && 'text-primary')}
    >
      {children}
    </a>
  )
}
const TopBar = () => {
  const navigate = useNavigate();
  return ( 
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6 z-10">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <a
          href="/admin/schedule"
          className="flex items-center gap-2 text-lg font-semibold md:text-base w-8"
        >
          <img src="/logo.svg" alt="logo" />
          <span className="sr-only">Acme Inc</span>
        </a>
        <MenuItem href="/admin/schedule">Agendamentos</MenuItem>
        <MenuItem href="/admin/clients">Clientes</MenuItem>
        <MenuItem href="/admin/services">Serviços</MenuItem>
        <MenuItem href="/admin/cashflow">Fluxo de caixa</MenuItem>
        <MenuItem href="/admin/settings">Configurações</MenuItem>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <a
              href="/admin/schedule"
              className="flex items-center gap-2 text-lg font-semibold md:text-base w-8"
            >
              <img src="/logo.svg" alt="logo" />
              <span className="sr-only">Acme Inc</span>
            </a>
            <MenuItem href="/admin/schedule">Agendamentos</MenuItem>
            <MenuItem href="/admin/clients">Clientes</MenuItem>
            <MenuItem href="/admin/services">Serviços</MenuItem>
            <MenuItem href="/admin/cashflow">Fluxo de caixa</MenuItem>
            <MenuItem href="/admin/settings">Configurações</MenuItem>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 ml-auto justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/admin/settings')}>Configurações</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/logout')}>Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
 
export default TopBar;