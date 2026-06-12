import {
  LayoutDashboard,
  Package,
  ArrowLeftRight,
  Tags,
  Truck,
  Users,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Produtos", to: "/products", icon: Package },
  { label: "Movimentações", to: "/stock/movements", icon: ArrowLeftRight },
  { label: "Categorias", to: "/categories", icon: Tags },
  { label: "Fornecedores", to: "/suppliers", icon: Truck },
  { label: "Usuários", to: "/users", icon: Users },
  { label: "Relatórios", to: "/reports", icon: BarChart3 },
  { label: "Configurações", to: "/settings", icon: Settings },
];
