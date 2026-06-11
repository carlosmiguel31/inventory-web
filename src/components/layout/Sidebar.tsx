import { NavLink } from "react-router-dom";
import { Boxes } from "lucide-react";

import { cn } from "@/lib/utils";
import { navItems } from "./nav-items";

interface SidebarProps {
  /** chamado ao clicar em um item (usado para fechar o drawer no mobile) */
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <div className="flex h-full flex-col bg-sidebar">
      {/* Marca */}
      <div className="flex h-16 items-center gap-2.5 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
          <Boxes className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-tight">Inventory</p>
          <p className="text-[11px] text-muted-foreground">Painel de estoque</p>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
        <p className="px-3 pb-1 pt-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Geral
        </p>
        {navItems.map(({ label, to, icon: Icon, soon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-foreground"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={cn(
                    "h-[18px] w-[18px] shrink-0 transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground",
                  )}
                />
                <span className="truncate">{label}</span>
                {soon && (
                  <span className="ml-auto rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    em breve
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Rodapé */}
      <div className="border-t border-border p-3">
        <div className="rounded-lg bg-secondary/40 p-3">
          <p className="text-xs font-medium text-foreground">Plano Free</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            120 / 500 produtos
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div className="h-full w-[24%] rounded-full bg-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}
