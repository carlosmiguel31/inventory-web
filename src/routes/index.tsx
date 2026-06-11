import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";

import { LoadingState } from "@/components/states";
import { MainLayout } from "@/components/layout/MainLayout";
import { AuthProvider } from "@/contexts/AuthProvider";
import { ProtectedRoute } from "@/guards/ProtectedRoute";
import { PublicRoute } from "@/guards/PublicRoute";
import { Dashboard } from "@/pages/Dashboard";
import { Login } from "@/pages/Login";

// Páginas de módulo carregadas sob demanda (code splitting).
const ProductsPage = lazy(() => import("@/features/products/pages/ProductsPage"));
const StockPage = lazy(() => import("@/features/stock/pages/StockPage"));
const SuppliersPage = lazy(() => import("@/features/suppliers/pages/SuppliersPage"));
const CategoriesPage = lazy(() => import("@/features/categories/pages/CategoriesPage"));
const UsersPage = lazy(() => import("@/features/users/pages/UsersPage"));
const ReportsPage = lazy(() => import("@/features/reports/pages/ReportsPage"));

/** Envolve um elemento lazy com Suspense + fallback de carregamento. */
function lazyElement(node: ReactNode) {
  return <Suspense fallback={<LoadingState />}>{node}</Suspense>;
}

export const router = createBrowserRouter([
  {
    // Rota raiz sem path: provê o AuthProvider dentro do contexto do router.
    element: (
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    ),
    children: [
      {
        path: "/login",
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Dashboard /> },

          // Módulos de negócio (infra pronta; CRUD a implementar).
          { path: "products", element: lazyElement(<ProductsPage />) },
          { path: "stock", element: lazyElement(<StockPage />) },
          { path: "suppliers", element: lazyElement(<SuppliersPage />) },
          { path: "categories", element: lazyElement(<CategoriesPage />) },
          { path: "users", element: lazyElement(<UsersPage />) },
          { path: "reports", element: lazyElement(<ReportsPage />) },

          // Aliases PT -> EN: mantêm os links atuais da Sidebar funcionando
          // sem precisar alterá-la.
          { path: "produtos", element: <Navigate to="/products" replace /> },
          { path: "estoque", element: <Navigate to="/stock" replace /> },
          { path: "fornecedores", element: <Navigate to="/suppliers" replace /> },
          { path: "categorias", element: <Navigate to="/categories" replace /> },
          { path: "usuarios", element: <Navigate to="/users" replace /> },
          { path: "relatorios", element: <Navigate to="/reports" replace /> },
        ],
      },
      {
        // Catch-all: redireciona para o dashboard.
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
