# Portfólio — Jonatas Craveiro

Portfólio pessoal, projeto de aprendizagem sem caráter comercial. Construído com Next.js, TypeScript e Tailwind CSS, empacotado com Docker para deploy em uma VM Oracle Cloud.

## Desenvolvimento local

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

### Testes e build

```bash
npm run lint
npm run test
npm run build
```

## Rodando com Docker

```bash
docker compose up --build
```

Abra http://localhost.

## Deploy na VM Oracle Cloud

1. Acesse a VM via SSH e garanta que Docker e Docker Compose estão instalados.
2. Clone este repositório na VM:
   ```bash
   git clone <url-do-repositorio>
   cd portifolio
   ```
3. Suba os containers:
   ```bash
   docker compose up -d --build
   ```
4. Libere a porta 80 nas regras de firewall/Security List da VM Oracle.
5. Acesse o site pelo IP público da VM.

Para atualizar após mudanças no código:

```bash
git pull
docker compose up -d --build
```
