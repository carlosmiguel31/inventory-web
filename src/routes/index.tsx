import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";

import { MainLayout } from "@/components/layout/MainLayout";
import { AuthProvider } from "@/contexts/AuthProvider";
import { ProtectedRoute } from "@/guards/ProtectedRoute";
import { PublicRoute } from "@/guards/PublicRoute";
import { Dashboard } from "@/pages/Dashboard";
import { Login } from "@/pages/Login";

export const router = createBrowserRouter([
  {
    // Rota raiz sem path: provê o AuthProvider para toda a árvore, já dentro
    // do contexto do React Router (necessário para useNavigate na auth).
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
          // CRUD (produtos, categorias, etc.) será adicionado aqui depois.
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
