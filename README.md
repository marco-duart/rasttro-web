# Rasttro — Web

Backoffice administrativo do Rasttro: membros, prospects, cargos e
permissões, financeiro, reuniões, eventos, comboios e comunicados. React
+ Panda CSS, pensado para a diretoria do motoclube gerenciar o clube pelo
navegador — o app mobile (fora do escopo desta rodada) cobre o dia a dia
dos membros.

## Stack

- React 19 + TypeScript + Vite
- **Panda CSS** para estilo (zero-runtime), com os temas do produto:
  **Asphalt** (escuro, padrão) e **Road Paper** (claro) — ver
  `panda.config.ts`
- React Router 8, TanStack React Query 5, React Hook Form + Zod
- Zustand para estado de sessão/tenant/tema (client-only, sem servidor)
- Ícones: lucide-react

## Setup local

```bash
cp .env.example .env.local   # ajuste VITE_API_URL se a API não estiver em localhost:3000
npm install
npm run panda:codegen        # gera styled-system/ (necessário antes do 1º build/dev)
npm run api:generate         # copia openapi.json do ../rasttro-server e gera tipos/zod
npm run dev
```

Pré-requisito: o `rasttro-server` rodando (veja o README dele) — o web
não sobe sozinho, ele é só o cliente da API.

## Client tipado (Kubb)

`npm run api:generate` lê `../rasttro-server/openapi.json` (gerado por
`npm run openapi:export` no server) e gera, em `src/api/generated/`:

- **tipos TypeScript** de cada schema/DTO (`models/`);
- **schemas Zod** correspondentes (`zod/`), usados como resolver do React
  Hook Form — o mesmo contrato que valida no server valida no formulário.

**Nunca editar nada em `src/api/generated`** — sempre rodar o script de
novo depois de mudar algo no server.

O client HTTP em si (`src/api/http.ts`) e os hooks de React Query (um por
feature, em `src/features/*/hooks.ts`) são escritos à mão sobre esses
tipos gerados: o ecossistema de geração de client/hooks do Kubb está em
transição de arquitetura entre versões (checado durante o
desenvolvimento) e não é confiável ainda para travar a build nele. Tipos
e validação continuam gerados a partir do contrato; a camada de
requisição é um wrapper fino e estável sobre axios, com os interceptors
de autenticação/tenant/refresh centralizados ali.

## Estrutura

```
src/
  api/            client HTTP + tipos de resposta (hand-written) + generated/ (Kubb)
  design-system/  primitivos de UI (Button, Card, Dialog, Field, ...)
  features/       api + hooks de dados por domínio (members, finance, roles, ...)
  layout/         casca do app (sidebar, topbar, navegação, banner de assinatura)
  routes/         páginas, organizadas por área
  stores/         zustand (auth, clube atual, tema, toasts)
  lib/            permissões (espelho do server), formatação, constantes
```

## Autenticação e multi-tenant no front

- Access token em memória (zustand), refresh token opaco em
  `localStorage`, renovado automaticamente pelo interceptor do axios num
  401.
- Todo request autenticado que depende de um clube envia o header
  `x-club-id` (clube selecionado, também em `localStorage`) — o mesmo
  contrato que o mobile vai usar.
- `useCurrentPermissions()` busca as permissões agregadas do membro no
  clube atual (`GET /clubs/current/permissions`) e é o que decide o que
  aparece na sidebar e o que fica habilitado nas páginas — nunca checagem
  hardcoded por nome de cargo.

## Scripts

| Script | Descrição |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento (Vite) |
| `npm run build` | Typecheck + build de produção |
| `npm run lint` | ESLint |
| `npm run panda:codegen` | Regenera `styled-system/` após mudar `panda.config.ts` |
| `npm run api:generate` | Regenera tipos/Zod a partir do OpenAPI do server |

## Deploy (VPS sem Docker)

`npm run build` gera `dist/` (estático). Sirva com Nginx apontando
`root` para `dist/`, com fallback de SPA (`try_files $uri /index.html`) e
proxy `/api/` para o `rasttro-server`.

## O que ainda falta / próximos passos

- Responsividade mobile do próprio backoffice é básica (sidebar
  desaparece abaixo de `lg`, sem drawer); a prioridade mobile real é o
  app nativo, fora do escopo desta rodada.
- Code-splitting por rota (hoje é um bundle único) — otimização, não
  bloqueia uso.
- Telas de Documentos/Patrimônio (Fase 5 do documento de produto) ainda
  não têm endpoint no server, então não têm tela aqui.
