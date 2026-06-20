# Portfólio Next.js + Docker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a one-page personal portfolio (Sobre / Projetos / Contato) with Next.js + TypeScript + Tailwind CSS, tested with Vitest, and packaged with Docker (Next.js app + Nginx reverse proxy) so it can be deployed on an Oracle Cloud VM.

**Architecture:** Static, data-driven Next.js App Router site. All profile/project content lives in one TypeScript data module (`src/data/profile.ts`); components read from it. No database, no CMS, no contact form/backend. Production build uses `output: "standalone"`, run inside a Node Alpine container, fronted by an `nginx:alpine` reverse proxy container — both orchestrated by `docker-compose.yml`.

**Tech Stack:** Next.js 16.2.9 (App Router, TypeScript, `src/` dir), Tailwind CSS v4, Vitest 4.1.9 + React Testing Library 16.3.2 + jsdom 29.1.1, Docker + Docker Compose.

## Global Constraints

- Scaffold with `create-next-app@latest`, flags: `--typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --turbopack=false`. Let it pin its own compatible `next`/`react`/`react-dom`/`tailwindcss`/`typescript`/`eslint` versions — do not override them manually.
- `next.config.ts` must set `output: "standalone"` (required for the Docker runtime stage to work).
- Test stack pinned exactly: `vitest@4.1.9`, `@vitejs/plugin-react@6.0.2`, `jsdom@29.1.1`, `@testing-library/react@16.3.2`, `@testing-library/jest-dom@6.9.1`.
- All content (name, title, bio, links, projects) lives in `src/data/profile.ts`. No database, no CMS.
- Contact section is links only (`mailto:`, GitHub, LinkedIn) — no form, no email-sending backend.
- One-page layout, navigation via anchors: `#sobre`, `#projetos`, `#contato`.
- Docker: multi-stage `Dockerfile` (`deps` → `builder` → `runner`) + `nginx:alpine` reverse proxy via `docker-compose.yml`. Only the `nginx` service publishes a host port (80); `app` is internal-only.
- Never stage with `git add -A` or `git add .` — always list explicit file paths in commits.
- `npm run lint`, `npm run test`, and `npm run build` must pass with no errors before any commit that changes app code.
- Real content to embed: name "Jonatas Craveiro", title "Desenvolvedor Full Stack", bio (provided below in Task 3), GitHub `https://github.com/jonatascraveiro`, LinkedIn `https://www.linkedin.com/in/jonatascraveiro`, email `jonatascraveiro@gmail.com`. Projects are 3 placeholders the user will replace later.

---

### Task 1: Scaffold the Next.js project

**Files:**
- Create (via CLI, not manually): `package.json`, `package-lock.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `next-env.d.ts`, `.gitignore`, `README.md`, `public/*.svg`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `src/app/favicon.ico`

**Interfaces:**
- Produces: a working Next.js App Router project rooted at the repo root, with `src/` directory and `@/*` import alias pointing at `src/*`. All later tasks build on this.

- [ ] **Step 1: Run create-next-app in the current directory**

```bash
npx --yes create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --turbopack=false --yes
```

Expected: command ends with `Success! Created portifolio at ...` and no errors. It is safe to run in this directory — it already contains only `.git/` and `docs/`, which create-next-app does not treat as conflicts.

- [ ] **Step 2: Verify the scaffold**

```bash
ls src/app && cat package.json
```

Expected: `src/app` contains `favicon.ico`, `globals.css`, `layout.tsx`, `page.tsx`. `package.json` has `"next": "16.2.9"` (or a newer compatible version) and scripts `dev`, `build`, `start`, `lint`.

- [ ] **Step 3: Commit the scaffold**

```bash
git add package.json package-lock.json tsconfig.json next.config.ts postcss.config.mjs eslint.config.mjs next-env.d.ts .gitignore README.md public src/app
git commit -m "chore: scaffold Next.js project with TypeScript, Tailwind and ESLint"
```

---

### Task 2: Configure standalone build output

**Files:**
- Modify: `next.config.ts`

**Interfaces:**
- Produces: `next build` emits `.next/standalone`, required by the Docker runtime stage in Task 9.

- [ ] **Step 1: Edit `next.config.ts`**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
};

export default nextConfig;
```

- [ ] **Step 2: Verify the build produces a standalone output**

```bash
npm run build && ls .next/standalone
```

Expected: build succeeds with `Compiled successfully`, and `.next/standalone` contains `server.js` and a `node_modules` directory.

- [ ] **Step 3: Commit**

```bash
git add next.config.ts
git commit -m "feat: enable standalone build output for Docker"
```

---

### Task 3: Profile data module

**Files:**
- Create: `src/data/profile.ts`

**Interfaces:**
- Produces: `Project` type (`{ name: string; description: string; stack: string[]; link?: string }`), `Profile` type (`{ name: string; title: string; bio: string; links: { github: string; linkedin: string; email: string }; projects: Project[] }`), and `profile: Profile` — the single export consumed by every component task (4–7).

- [ ] **Step 1: Create the data file**

```ts
export type Project = {
  name: string;
  description: string;
  stack: string[];
  link?: string;
};

export type Profile = {
  name: string;
  title: string;
  bio: string;
  links: {
    github: string;
    linkedin: string;
    email: string;
  };
  projects: Project[];
};

export const profile: Profile = {
  name: "Jonatas Craveiro",
  title: "Desenvolvedor Full Stack",
  bio: "Profissional formado em Sistemas para Internet, com experiência na Secretaria de Saúde do Município de Campo Grande/MS, atuando com Sistemas de Informação em Saúde. Atuo no desenvolvimento de aplicações web utilizando React.js e TypeScript, com conhecimentos em Next.js, consumo de APIs REST/GraphQL, versionamento com Git, estilização com CSS, Tailwind e Bootstrap.",
  links: {
    github: "https://github.com/jonatascraveiro",
    linkedin: "https://www.linkedin.com/in/jonatascraveiro",
    email: "jonatascraveiro@gmail.com",
  },
  projects: [
    {
      name: "Projeto Exemplo 1",
      description: "Descrição breve do projeto exemplo 1. Substitua pelo seu projeto real.",
      stack: ["React", "TypeScript", "Tailwind CSS"],
      link: "https://github.com/jonatascraveiro",
    },
    {
      name: "Projeto Exemplo 2",
      description: "Descrição breve do projeto exemplo 2. Substitua pelo seu projeto real.",
      stack: ["Next.js", "Node.js", "PostgreSQL"],
      link: "https://github.com/jonatascraveiro",
    },
    {
      name: "Projeto Exemplo 3",
      description: "Descrição breve do projeto exemplo 3. Substitua pelo seu projeto real.",
      stack: ["TypeScript", "API REST"],
    },
  ],
};
```

- [ ] **Step 2: Verify it type-checks**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/data/profile.ts
git commit -m "feat: add static profile data module"
```

---

### Task 4: Test tooling + Header component

**Files:**
- Create: `vitest.config.ts`, `vitest.setup.ts`, `src/components/Header.tsx`, `src/components/Header.test.tsx`
- Modify: `package.json` (scripts)

**Interfaces:**
- Consumes: nothing (Header has no props).
- Produces: Vitest config/setup reused by every later test task. `Header` default-exports a component with no props, rendering `<a href="#sobre">Sobre</a>`, `<a href="#projetos">Projetos</a>`, `<a href="#contato">Contato</a>`.

- [ ] **Step 1: Install test dependencies**

```bash
npm install -D vitest@4.1.9 @vitejs/plugin-react@6.0.2 jsdom@29.1.1 @testing-library/react@16.3.2 @testing-library/jest-dom@6.9.1
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

- [ ] **Step 3: Create `vitest.setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: Add test scripts to `package.json`**

In the `"scripts"` object, add:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Write the failing test — `src/components/Header.test.tsx`**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "./Header";

describe("Header", () => {
  it("renders navigation links to all three sections", () => {
    render(<Header />);

    expect(screen.getByRole("link", { name: "Sobre" })).toHaveAttribute("href", "#sobre");
    expect(screen.getByRole("link", { name: "Projetos" })).toHaveAttribute("href", "#projetos");
    expect(screen.getByRole("link", { name: "Contato" })).toHaveAttribute("href", "#contato");
  });
});
```

- [ ] **Step 6: Run the test to verify it fails**

```bash
npm run test
```

Expected: FAIL — `Cannot find module './Header'` (component does not exist yet).

- [ ] **Step 7: Implement `src/components/Header.tsx`**

```tsx
import Link from "next/link";

const NAV_ITEMS = [
  { href: "#sobre", label: "Sobre" },
  { href: "#projetos", label: "Projetos" },
  { href: "#contato", label: "Contato" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-3xl justify-end gap-6 px-6 py-4">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-sm font-medium text-zinc-700 hover:text-zinc-950"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
```

- [ ] **Step 8: Run the test to verify it passes**

```bash
npm run test
```

Expected: PASS — 1 test passed.

- [ ] **Step 9: Commit**

```bash
git add vitest.config.ts vitest.setup.ts package.json package-lock.json src/components/Header.tsx src/components/Header.test.tsx
git commit -m "test: add Vitest setup and Header component"
```

---

### Task 5: About component

**Files:**
- Create: `src/components/About.tsx`, `src/components/About.test.tsx`

**Interfaces:**
- Consumes: `profile` from `@/data/profile` (Task 3).
- Produces: `About` default-exports a component with no props, rendering an `<section id="sobre">` with the profile name/title and bio text.

- [ ] **Step 1: Write the failing test — `src/components/About.test.tsx`**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import About from "./About";
import { profile } from "@/data/profile";

describe("About", () => {
  it("renders the profile name, title and bio", () => {
    render(<About />);

    expect(screen.getByText(`${profile.name} — ${profile.title}`)).toBeInTheDocument();
    expect(screen.getByText(profile.bio)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm run test
```

Expected: FAIL — `Cannot find module './About'`.

- [ ] **Step 3: Implement `src/components/About.tsx`**

```tsx
import { profile } from "@/data/profile";

export default function About() {
  return (
    <section id="sobre" className="mx-auto max-w-3xl px-6 py-16">
      <h2 className="text-2xl font-semibold text-zinc-900">Sobre</h2>
      <p className="mt-4 text-lg font-medium text-zinc-900">
        {profile.name} — {profile.title}
      </p>
      <p className="mt-4 leading-relaxed text-zinc-700">{profile.bio}</p>
    </section>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm run test
```

Expected: PASS — all tests passed.

- [ ] **Step 5: Commit**

```bash
git add src/components/About.tsx src/components/About.test.tsx
git commit -m "feat: add About component"
```

---

### Task 6: ProjectCard + Projects components

**Files:**
- Create: `src/components/ProjectCard.tsx`, `src/components/Projects.tsx`, `src/components/Projects.test.tsx`

**Interfaces:**
- Consumes: `profile`, `Project` type from `@/data/profile` (Task 3).
- Produces: `ProjectCard` default-exports a component with props `{ project: Project }`, rendering an `<article>` with name/description/stack/optional link. `Projects` default-exports a component with no props, rendering `<section id="projetos">` with one `ProjectCard` per `profile.projects` entry.

- [ ] **Step 1: Write the failing test — `src/components/Projects.test.tsx`**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Projects from "./Projects";
import { profile } from "@/data/profile";

describe("Projects", () => {
  it("renders one card per project with name, description and stack", () => {
    render(<Projects />);

    expect(screen.getAllByRole("article")).toHaveLength(profile.projects.length);

    for (const project of profile.projects) {
      expect(screen.getByText(project.name)).toBeInTheDocument();
      expect(screen.getByText(project.description)).toBeInTheDocument();
      for (const tech of project.stack) {
        expect(screen.getAllByText(tech).length).toBeGreaterThan(0);
      }
    }
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm run test
```

Expected: FAIL — `Cannot find module './Projects'`.

- [ ] **Step 3: Implement `src/components/ProjectCard.tsx`**

```tsx
import type { Project } from "@/data/profile";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="rounded-lg border border-zinc-200 p-6">
      <h3 className="text-lg font-semibold text-zinc-900">{project.name}</h3>
      <p className="mt-2 text-zinc-700">{project.description}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <li
            key={tech}
            className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700"
          >
            {tech}
          </li>
        ))}
      </ul>
      {project.link && (
        <a
          href={project.link}
          className="mt-4 inline-block text-sm font-medium text-zinc-900 underline"
        >
          Ver projeto
        </a>
      )}
    </article>
  );
}
```

- [ ] **Step 4: Implement `src/components/Projects.tsx`**

```tsx
import { profile } from "@/data/profile";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  return (
    <section id="projetos" className="mx-auto max-w-3xl px-6 py-16">
      <h2 className="text-2xl font-semibold text-zinc-900">Projetos</h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {profile.projects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Run the test to verify it passes**

```bash
npm run test
```

Expected: PASS — all tests passed.

- [ ] **Step 6: Commit**

```bash
git add src/components/ProjectCard.tsx src/components/Projects.tsx src/components/Projects.test.tsx
git commit -m "feat: add Projects and ProjectCard components"
```

---

### Task 7: Contact component

**Files:**
- Create: `src/components/Contact.tsx`, `src/components/Contact.test.tsx`

**Interfaces:**
- Consumes: `profile` from `@/data/profile` (Task 3).
- Produces: `Contact` default-exports a component with no props, rendering `<section id="contato">` with links to email (`mailto:`), GitHub and LinkedIn.

- [ ] **Step 1: Write the failing test — `src/components/Contact.test.tsx`**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Contact from "./Contact";
import { profile } from "@/data/profile";

describe("Contact", () => {
  it("renders links to email, GitHub and LinkedIn", () => {
    render(<Contact />);

    expect(screen.getByRole("link", { name: profile.links.email })).toHaveAttribute(
      "href",
      `mailto:${profile.links.email}`
    );
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      profile.links.github
    );
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      profile.links.linkedin
    );
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm run test
```

Expected: FAIL — `Cannot find module './Contact'`.

- [ ] **Step 3: Implement `src/components/Contact.tsx`**

```tsx
import { profile } from "@/data/profile";

export default function Contact() {
  return (
    <section id="contato" className="mx-auto max-w-3xl px-6 py-16">
      <h2 className="text-2xl font-semibold text-zinc-900">Contato</h2>
      <ul className="mt-6 flex flex-col gap-3">
        <li>
          <a
            href={`mailto:${profile.links.email}`}
            className="text-zinc-700 underline hover:text-zinc-950"
          >
            {profile.links.email}
          </a>
        </li>
        <li>
          <a
            href={profile.links.github}
            className="text-zinc-700 underline hover:text-zinc-950"
          >
            GitHub
          </a>
        </li>
        <li>
          <a
            href={profile.links.linkedin}
            className="text-zinc-700 underline hover:text-zinc-950"
          >
            LinkedIn
          </a>
        </li>
      </ul>
    </section>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm run test
```

Expected: PASS — all tests passed.

- [ ] **Step 5: Commit**

```bash
git add src/components/Contact.tsx src/components/Contact.test.tsx
git commit -m "feat: add Contact component"
```

---

### Task 8: Hero, Footer, and page assembly

**Files:**
- Create: `src/components/Hero.tsx`, `src/components/Footer.tsx`
- Modify: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`

**Interfaces:**
- Consumes: `profile` from `@/data/profile` (Task 3); `Header`, `About`, `Projects`, `Contact` (Tasks 4–7).
- Produces: the assembled home page — no further tasks depend on this one.

- [ ] **Step 1: Implement `src/components/Hero.tsx`**

```tsx
import { profile } from "@/data/profile";

export default function Hero() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-4xl font-bold text-zinc-900">{profile.name}</h1>
      <p className="mt-3 text-xl text-zinc-600">{profile.title}</p>
    </section>
  );
}
```

- [ ] **Step 2: Implement `src/components/Footer.tsx`**

```tsx
export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 py-6">
      <p className="mx-auto max-w-3xl px-6 text-sm text-zinc-500">
        © {new Date().getFullYear()} Jonatas Craveiro. Projeto pessoal sem fins comerciais.
      </p>
    </footer>
  );
}
```

- [ ] **Step 3: Replace `src/app/globals.css`**

```css
@import "tailwindcss";

html {
  scroll-behavior: smooth;
}
```

- [ ] **Step 4: Replace `src/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jonatas Craveiro — Portfólio",
  description: "Portfólio pessoal de Jonatas Craveiro, Desenvolvedor Full Stack.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen flex-col bg-white text-zinc-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Replace `src/app/page.tsx`**

```tsx
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <Contact />
    </>
  );
}
```

- [ ] **Step 6: Run full verification**

```bash
npm run lint && npm run test && npm run build
```

Expected: all three commands succeed with no errors.

- [ ] **Step 7: Manual smoke test**

```bash
npm run start
```

Open `http://localhost:3000`, confirm Hero, Sobre, Projetos and Contato sections render, the header links scroll to each section, and the contact links have correct `href`s. Stop the server with Ctrl+C.

- [ ] **Step 8: Commit**

```bash
git add src/components/Hero.tsx src/components/Footer.tsx src/app/layout.tsx src/app/page.tsx src/app/globals.css
git commit -m "feat: assemble portfolio home page"
```

---

### Task 9: Dockerfile for the Next.js app

**Files:**
- Create: `Dockerfile`, `.dockerignore`

**Interfaces:**
- Consumes: `.next/standalone` output (Task 2).
- Produces: a Docker image that runs the app on port 3000, consumed by the `app` service in Task 10's `docker-compose.yml`.

- [ ] **Step 1: Create `.dockerignore`**

```
node_modules
.next
.git
docs
*.md
npm-debug.log*
```

- [ ] **Step 2: Create `Dockerfile`**

```dockerfile
# syntax=docker/dockerfile:1

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

- [ ] **Step 3: Build and run the image standalone to verify it works**

```bash
docker build -t portifolio-app .
docker run --rm -p 3000:3000 portifolio-app
```

Open `http://localhost:3000` and confirm the page loads with all sections. Stop with Ctrl+C.

- [ ] **Step 4: Commit**

```bash
git add Dockerfile .dockerignore
git commit -m "feat: add multi-stage Dockerfile for standalone Next.js build"
```

---

### Task 10: Nginx reverse proxy + docker-compose

**Files:**
- Create: `nginx/nginx.conf`, `docker-compose.yml`

**Interfaces:**
- Consumes: the `app` image built from `Dockerfile` (Task 9), listening on port 3000 inside the Docker network.
- Produces: a `docker compose up` stack reachable on host port 80 — the final deployable artifact for the VM.

- [ ] **Step 1: Create `nginx/nginx.conf`**

```nginx
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://app:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

- [ ] **Step 2: Create `docker-compose.yml`**

```yaml
services:
  app:
    build: .
    restart: unless-stopped
    expose:
      - "3000"

  nginx:
    image: nginx:alpine
    restart: unless-stopped
    depends_on:
      - app
    ports:
      - "80:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf:ro
```

- [ ] **Step 3: Verify the full stack**

```bash
docker compose up --build -d
curl -s -o /dev/null -w "%{http_code}\n" http://localhost
```

Expected: prints `200`. Then tear down:

```bash
docker compose down
```

- [ ] **Step 4: Commit**

```bash
git add nginx/nginx.conf docker-compose.yml
git commit -m "feat: add nginx reverse proxy and docker-compose stack"
```

---

### Task 11: README with run and deploy instructions

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: nothing — documentation only. No later tasks depend on this one.

- [ ] **Step 1: Replace `README.md`**

```markdown
# Portfólio — Jonatas Craveiro

Portfólio pessoal, projeto de aprendizagem sem caráter comercial. Construído com Next.js, TypeScript e Tailwind CSS, empacotado com Docker para deploy em uma VM Oracle Cloud.

## Desenvolvimento local

\`\`\`bash
npm install
npm run dev
\`\`\`

Abra http://localhost:3000.

### Testes e build

\`\`\`bash
npm run lint
npm run test
npm run build
\`\`\`

## Rodando com Docker

\`\`\`bash
docker compose up --build
\`\`\`

Abra http://localhost.

## Deploy na VM Oracle Cloud

1. Acesse a VM via SSH e garanta que Docker e Docker Compose estão instalados.
2. Clone este repositório na VM:
   \`\`\`bash
   git clone <url-do-repositorio>
   cd portifolio
   \`\`\`
3. Suba os containers:
   \`\`\`bash
   docker compose up -d --build
   \`\`\`
4. Libere a porta 80 nas regras de firewall/Security List da VM Oracle.
5. Acesse o site pelo IP público da VM.

Para atualizar após mudanças no código:

\`\`\`bash
git pull
docker compose up -d --build
\`\`\`
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add setup, testing and VM deploy instructions"
```
