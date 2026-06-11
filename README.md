# Inventory Web

Frontend premium para a **Inventory API** — painel de controle de estoque.

Construído com foco em produção, dark mode por padrão e estética inspirada em
Linear, Vercel, Stripe, Raycast e Notion.

> **Status:** scaffold inicial. Inclui estrutura, layout, sidebar responsiva,
> header, página de login e dashboard com dados de exemplo.
> **Ainda não implementado:** integração com a API, CRUD e autenticação real.

## Stack

- React 18 + Vite + TypeScript
- Tailwind CSS + shadcn/ui (estilo _new-york_)
- React Router (data router)
- Axios (instância configurada, sem chamadas ainda)
- TanStack Query (provider configurado)
- Lucide React (ícones)
- Fonte **Inter**

## Pré-requisitos

- Node.js 18+ (recomendado 20+)
- npm 9+ (ou pnpm / yarn)

## Como executar

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# edite .env se a API estiver em outra URL

# 3. Rodar em desenvolvimento
npm run dev
# abre em http://localhost:5173

# Build de produção
npm run build
npm run preview
```

## Rotas

| Rota     | Página     | Layout       |
| -------- | ---------- | ------------ |
| `/login` | Login      | sem layout   |
| `/`      | Dashboard  | `MainLayout` |
| `*`      | redireciona para `/`        |

## Estrutura

```
src/
├── components/
│   ├── layout/   → MainLayout, Sidebar, Header, nav-items
│   └── ui/       → componentes shadcn/ui
├── pages/        → Login, Dashboard
├── routes/       → definição de rotas
├── lib/          → utils (cn), axios, query-client
├── hooks/        → (vazio, para uso futuro)
└── types/        → (vazio, para uso futuro)
```

## Design System

Cores definidas como tokens HSL em `src/index.css` e mapeadas no
`tailwind.config.ts` (`bg-background`, `text-muted-foreground`, `bg-primary`,
`text-success`, etc.).

## Próximos passos

1. Conectar a Inventory API via `src/lib/axios.ts`
2. Autenticação real com JWT (guardas de rota)
3. CRUD de produtos, categorias e fornecedores com TanStack Query
