import { useState, type FormEvent } from "react";
import { ArrowRight, Boxes, Lock, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { getErrorMessage } from "@/utils/errors";

export function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // login() consome POST /api/auth/login e navega para o dashboard.
      await login({ email, password });
    } catch (err) {
      setError(getErrorMessage(err, "Não foi possível entrar. Verifique suas credenciais."));
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Painel de marca */}
      <div className="ambient-glow relative hidden flex-col justify-between border-r border-border bg-sidebar p-12 lg:flex">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Boxes className="h-5 w-5" />
          </div>
          <span className="text-base font-semibold tracking-tight">
            Inventory
          </span>
        </div>

        <div className="max-w-md">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight">
            Controle total do seu estoque, em tempo real.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Produtos, categorias e fornecedores em um só lugar. Visão clara das
            entradas e saídas, alertas de baixo estoque e relatórios prontos
            para decisão.
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs text-muted-foreground">
          <span>SKUs ilimitados</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span>Multiusuário</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span>Exportação CSV</span>
        </div>
      </div>

      {/* Formulário */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm animate-fade-in">
          {/* Marca compacta (mobile) */}
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Boxes className="h-5 w-5" />
            </div>
            <span className="text-base font-semibold tracking-tight">
              Inventory
            </span>
          </div>

          <div className="mb-7">
            <h2 className="text-xl font-semibold tracking-tight">
              Entrar na conta
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Use suas credenciais para acessar o painel.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="voce@empresa.com"
                  autoComplete="email"
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <button
                  type="button"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Ainda não tem conta?{" "}
            <button
              type="button"
              className="font-medium text-primary hover:underline"
            >
              Falar com o time
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
