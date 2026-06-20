# Design — Portfólio Next.js com Docker

**Data:** 19/06/2026
**Autor:** Jonatas Craveiro (com assistência do Claude Code)
**Objetivo:** Criar um site de portfólio pessoal com Next.js, sem caráter comercial, para fins de aprendizagem, com Docker para facilitar o deploy/migração para uma VM da Oracle Cloud.

## Visão geral

Site de página única (one-page) com três seções — Sobre, Projetos e Contato — navegáveis por âncoras. Conteúdo estático (sem CMS/banco de dados). Empacotado com Docker (Next.js + Nginx como reverse proxy) para rodar em uma VM Oracle.

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** para estilização
- **Vitest** + **React Testing Library** para testes de componentes
- **Docker** + **docker-compose** (serviços `app` e `nginx`)

## Arquitetura

- Dados do perfil (nome, título, bio, links, projetos) centralizados em `src/data/profile.ts`, sem banco de dados.
- Build do Next.js com `output: 'standalone'` para gerar uma imagem Docker leve (apenas os arquivos necessários para rodar em produção).
- `docker-compose.yml` orquestra dois serviços na mesma rede:
  - `app`: container Next.js, expõe a porta 3000 internamente.
  - `nginx`: container `nginx:alpine`, faz `proxy_pass` para `app:3000`, expõe a porta 80 da VM.
- Navegação por âncoras (`#sobre`, `#projetos`, `#contato`) com scroll suave via CSS.

## Estrutura de pastas

```
portifolio/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx          (Hero + Sobre + Projetos + Contato)
│   │   └── globals.css
│   ├── components/
│   │   ├── Header.tsx        (nav com âncoras, scroll suave)
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Projects.tsx
│   │   ├── ProjectCard.tsx
│   │   └── Contact.tsx
│   └── data/
│       └── profile.ts        (nome, título, bio, links, projetos)
├── public/
├── Dockerfile                 (multi-stage: deps → builder → runner)
├── docker-compose.yml
├── nginx/
│   └── nginx.conf
├── .dockerignore
├── .env.example
├── vitest.config.ts
└── (arquivos padrão do Next.js: next.config.ts, tailwind.config.ts, package.json, tsconfig.json)
```

## Dados (conteúdo real)

`src/data/profile.ts` exporta um objeto com:

- `name`: "Jonatas Craveiro"
- `title`: "Desenvolvedor Full Stack"
- `bio`: "Profissional formado em Sistemas para Internet, com experiência na Secretaria de Saúde do Município de Campo Grande/MS, atuando com Sistemas de Informação em Saúde. Atuo no desenvolvimento de aplicações web utilizando React.js e TypeScript, com conhecimentos em Next.js, consumo de APIs REST/GraphQL, versionamento com Git, estilização com CSS, Tailwind e Bootstrap."
- `links`: `{ github: "https://github.com/jonatascraveiro", linkedin: "https://www.linkedin.com/in/jonatascraveiro", email: "jonatascraveiro@gmail.com" }`
- `projects`: lista de 3 projetos placeholder (nome, descrição e stack genéricos), a serem substituídos pelo usuário depois pelos projetos reais

## Componentes

- **Header**: nav fixa no topo com links para `#sobre`, `#projetos`, `#contato`.
- **Hero**: nome e título em destaque.
- **About**: renderiza nome, título e bio do `profile.ts`.
- **Projects**: grid de `ProjectCard`, um por item em `profile.projects`.
- **ProjectCard**: nome, descrição, lista de stack, link (se houver).
- **Contact**: apenas links clicáveis (mailto, GitHub, LinkedIn) com ícones — sem formulário, sem envio de e-mail.
- **Footer**: copyright simples.

## Docker / Deploy

- **Dockerfile** multi-stage:
  1. `deps`: instala dependências (`npm ci`)
  2. `builder`: copia código, roda `next build` (com `output: 'standalone'`)
  3. `runner`: imagem `node:20-alpine`, copia apenas `.next/standalone` e assets públicos, expõe porta 3000, `CMD ["node", "server.js"]`
- **nginx/nginx.conf**: `proxy_pass http://app:3000;`, escuta na porta 80.
- **docker-compose.yml**: define `app` e `nginx` na mesma rede; `nginx` é o único serviço com porta publicada (80) para o host/VM.
- **README**: instruções de build/run local (`docker compose up --build`) e passo a passo de deploy na VM Oracle (clonar repositório, `docker compose up -d --build`).

## Testes

- **Vitest** + **React Testing Library**, ambiente `jsdom`.
- Cobertura inicial:
  - `Header`: renderiza os 3 links de navegação com os `href` corretos (`#sobre`, `#projetos`, `#contato`).
  - `About`: renderiza nome, título e bio vindos de `profile.ts`.
  - `Projects`/`ProjectCard`: renderiza a quantidade correta de projetos, com nome/descrição/stack de cada um.
  - `Contact`: renderiza os links com `href` corretos (`mailto:`, GitHub, LinkedIn).
- Scripts: `npm run test` (vitest run) e `npm run test:watch`.
- Critério de aceite: `npm run lint`, `npm run build` e `npm run test` devem passar sem erros antes de qualquer commit.

## Fora de escopo

- HTTPS / certificado SSL (Let's Encrypt) — pode ser adicionado depois na VM
- CI/CD automatizado
- CMS ou banco de dados
- Formulário de contato com envio de e-mail
- Blog/artigos
- Testes E2E (Playwright/Cypress)
