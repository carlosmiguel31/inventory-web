import {
  LayoutDashboard,
  Package,
  Tags,
  Truck,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  /** rota ainda não implementada (CRUD virá depois) */
  soon?: boolean;
}

export const navItems: NavItem[] = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Produtos", to: "/products", icon: Package },
  { label: "Categorias", to: "/categorias", icon: Tags, soon: true },
  { label: "Fornecedores", to: "/fornecedores", icon: Truck, soon: true },
  { label: "Relatórios", to: "/relatorios", icon: BarChart3, soon: true },
  { label: "Configurações", to: "/configuracoes", icon: Settings, soon: true },
];
