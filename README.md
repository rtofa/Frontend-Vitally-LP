<div align="center">

    <h1>🏋️ Vitally — Equipamentos de Academia</h1>
    <p><strong>Landing page e e-commerce para equipamentos de academia comerciais e residenciais.</strong></p>
    <p>
        <a href="https://nextjs.org/"><img alt="Next.js" src="https://img.shields.io/badge/Next.js-13.5-black?logo=next.js"></a>
        <a href="https://react.dev/"><img alt="React" src="https://img.shields.io/badge/React-18.2-61DAFB?logo=react"></a>
        <a href="https://typescriptlang.org/"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.2-3178C6?logo=typescript"></a>
        <a href="https://tailwindcss.com/"><img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-3.3-06B6D4?logo=tailwindcss"></a>
        <a href="https://www.docker.com/"><img alt="Docker" src="https://img.shields.io/badge/Docker-ready-2496ED?logo=docker"></a>
    </p>
# 🏋️ Vitally — Equipamentos de Academia

**Landing page e e-commerce para equipamentos de academia comerciais e residenciais.**

![Next.js](https://img.shields.io/badge/Next.js-13.5-black?logo=next.js)
![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.3-06B6D4?logo=tailwindcss)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker)

</div>

---

## 📋 Índice

- [Visão Geral](#visao-geral)
- [Tech Stack](#tech-stack)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pre-requisitos)
- [Instalação e Execução](#instalacao-e-execucao)
- [Variáveis de Ambiente](#variaveis-de-ambiente)
- [Arquitetura](#arquitetura)
- [Painel Administrativo](#painel-administrativo)
- [Deploy com Docker](#deploy-com-docker)
- [Scripts Disponíveis](#scripts-disponiveis)

---

## 🎯 Visão Geral

Front-end completo para a **Vitally**, uma loja de equipamentos de academia. O projeto inclui:

- **Landing Page** — Seções hero com carrossel de banners, categorias, produtos em destaque e vantagens
- **Loja (Shop)** — Catálogo de produtos com filtros por categoria, busca e página de detalhes
- **Carrinho** — Carrinho de compras com geração de leads/orçamentos
- **Contato** — Formulário de contato integrado ao backend
- **Painel Admin** — CRUD completo de banners, produtos, categorias e gestão de leads

---

## 🛠 Tech Stack

| Camada | Tecnologia |
| --- | --- |
| **Framework** | Next.js 13.5 (App Router, SSR/SSG) |
| **UI** | React 18 + TypeScript 5.2 |
| **Estilização** | Tailwind CSS 3.3 + tailwindcss-animate |
| **Componentes** | Radix UI (Dialog, Dropdown, Tabs, Toast, etc.) |
| **Formulários** | React Hook Form + Zod |
| **HTTP** | Axios (instância configurada com interceptors de auth) |
| **Gráficos** | Recharts |
| **Carrossel** | Embla Carousel |
| **Ícones** | Lucide React |
| **Deploy** | Docker multi-stage + Netlify |
| **Backend** | Spring Boot (Java) — repositório separado |

---

## 📁 Estrutura do Projeto

```
vitally-LP-similar-ecomerce/
├── app/
│   ├── (site)/
│   │   ├── page.tsx              # Home (landing page)
│   │   ├── layout.tsx            # Layout público (Header + Footer)
│   │   ├── carrinho/             # Página do carrinho
│   │   ├── contato/              # Página de contato
│   │   └── shop/                 # Loja (catálogo + detalhe de produto)
│   ├── admin/
│   │   ├── layout.tsx            # Layout do admin (sidebar + auth guard)
│   │   ├── page.tsx              # Dashboard
│   │   ├── login/
│   │   ├── banners/              # CRUD de banners
│   │   ├── products/             # CRUD de produtos
│   │   ├── categories/           # CRUD de categorias
│   │   └── leads/                # Gestão de leads
│   ├── layout.tsx                # Root layout (fontes, metadata)
│   └── globals.css               # Estilos globais + tema dark
│
├── components/
│   ├── admin/
│   │   ├── ImageUploadField.tsx  # Campo de upload reutilizável
│   │   ├── banners/              # BannerForm + BannerTable
│   │   ├── products/             # ProductForm + ProductTable
│   │   ├── categories/           # CategoryForm + CategoryTable
│   │   └── leads/                # LeadsTable
│   ├── home/
│   │   ├── HeroSection.tsx       # Carrossel hero com banners
│   │   ├── CategoryBanner.tsx    # Grid de categorias
│   │   ├── FeaturedProducts.tsx  # Produtos em destaque
│   │   └── PerksStrip.tsx        # Faixa de vantagens
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── shop/
│   │   ├── ShopClient.tsx        # Catálogo com filtros
│   │   ├── ProductCard.tsx
│   │   └── ProductDetail.tsx
│   ├── cart/
│   │   ├── CartContext.tsx       # Context API do carrinho
│   │   ├── CartDrawer.tsx        # Drawer lateral
│   │   └── LeadModal.tsx         # Modal de orçamento
│   └── ui/                       # Componentes base (Radix/shadcn)
│
├── hooks/
│   ├── useImageUpload.ts         # Hook Double-Hop de upload
│   ├── use-toast.ts
│   └── admin/
│       ├── useBanners.ts
│       ├── useCategories.ts
│       ├── useProducts.ts
│       └── useLeads.ts
│
├── lib/
│   ├── api.ts                    # Instância Axios com interceptors
│   ├── api-types.ts              # Tipos TypeScript das entidades
│   ├── auth.ts                   # Helpers de autenticação
│   ├── utils.ts                  # Utilitários (cn, etc.)
│   └── services/
│       ├── auth.ts
│       ├── banners.ts
│       ├── categories.ts
│       ├── products.ts
│       ├── leads.ts
│       └── uploads.ts
│
├── public/                       # Assets estáticos (logos, ícones)
├── Dockerfile                    # Build multi-stage otimizado
├── docker-compose.yaml           # Orquestração front + back
├── next.config.js
├── tailwind.config.ts
└── package.json
```

---

## ✅ Pré-requisitos

- **Node.js** >= 18
- **npm** >= 9
- **Backend** Spring Boot rodando em `http://localhost:8080`

---

## 🚀 Instalação e Execução

```bash
# 1. Clone o repositório
git clone https://github.com/rtofa/Frontend-Vitally-LP.git
cd Frontend-Vitally-LP

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com a URL do seu backend

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) 🎉

---

## 🔑 Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# URL base da API do backend Spring Boot
NEXT_PUBLIC_API_URL=http://localhost:8080
```

> As requisições para `/api/*` são automaticamente reescritas via `next.config.js` para o backend.

---

## 🏗 Arquitetura

### Comunicação com o Backend

O front-end usa uma instância Axios centralizada (`lib/api.ts`) que:

1. Injeta automaticamente o token JWT via interceptor de request
2. Redireciona para `/admin/login` em caso de 401/403
3. Usa `Content-Type: application/json` por padrão

### Padrão Double-Hop (Upload de Imagens)

Para uploads de imagens, o projeto implementa uma arquitetura **Double-Hop** que separa o upload do arquivo da submissão da entidade:

```
Hop 1 — Upload do arquivo
  Usuário escolhe imagem
    → POST /uploads/image  (multipart/form-data)
    ← { "url": "https://..." }
    → URL salva no estado do formulário + preview exibido

Hop 2 — Submissão da entidade
  Usuário clica em "Salvar"
    → POST /products  (application/json)
       { "imageUrl": "https://...", ... }
```

- **Hop 1:** `useImageUpload` hook → `POST /uploads/image` com `FormData`
- **Hop 2:** Formulário envia JSON puro com a URL retornada no Hop 1

### Camadas do Código

```
Componentes (UI) → Hooks (lógica) → Services (HTTP) → API (Axios)
```

---

## 🔐 Painel Administrativo

Acesse em `/admin/login`. O painel oferece:

| Recurso | Funcionalidades |
| --- | --- |
| **Dashboard** | Visão geral com métricas e gráficos |
| **Banners** | CRUD completo + ativar/desativar + upload de imagem |
| **Produtos** | CRUD + vinculação a categorias + upload de imagem |
| **Categorias** | CRUD + ativar/desativar + upload de imagem |
| **Leads** | Listagem de orçamentos e contatos recebidos |

> A autenticação é feita via JWT, armazenado em `localStorage` e replicado como cookie para o middleware do Next.js.

---

## 🐳 Deploy com Docker

### Build individual (apenas front-end)

```bash
docker build -t vitally-frontend .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.vitallyoficial.com.br/api/v1 \
  vitally-frontend
```

### Stack completa (front + back)

```bash
docker-compose up -d --build
```

O `docker-compose.yaml` orquestra:
- **vitally-backend** → porta `8080`
- **vitally-frontend** → porta `3000`

> O Dockerfile usa build multi-stage com 3 etapas (deps → build → runner) para gerar uma imagem otimizada com `output: 'standalone'`.

---

## 📜 Scripts Disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Cria o build de produção |
| `npm run start` | Inicia o servidor de produção |
| `npm run lint` | Executa o ESLint |
| `npm run typecheck` | Verificação de tipos TypeScript |

---

<div align="center">

**Feito com 💚 para a Vitally**

</div>
