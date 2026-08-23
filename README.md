This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Infra & Banco de Dados (recomendações)

Este projeto foi preparado com rotas e APIs placeholder para facilitar a integração com um banco real.

- Sugestões de bancos gerenciados:
	- **Supabase / PostgreSQL** — fácil de usar, ótimo para aplicações relacionais.
	- **Neon (Postgres)** — serverless Postgres com boa escalabilidade.
	- **PlanetScale (MySQL)** — bom para escalabilidade horizontal e deploys contínuos.
	- **MongoDB Atlas** — se preferir um modelo de documento.
	- **Firebase Firestore** — simples para protótipos e integrações com mobile.

- Recomendação inicial: Supabase (Postgres) para agendamento e conteúdo dinâmico; armazene imagens no próprio bucket do Supabase ou em S3/Cloud Storage.

### Variáveis de ambiente sugeridas

- `DATABASE_URL` — string de conexão para o seu Postgres/MySQL.
- `SUPABASE_URL` e `SUPABASE_KEY` — se optar por Supabase.
- `NEXT_PUBLIC_BASE_URL` — URL pública da aplicação (útil para chamadas server -> client em ambientes sem suporte a fetch interno).

### Segurança e deploy

- Use HTTPS em produção e configure `Strict-Transport-Security` no servidor/proxy.
- Proteja rotas administrativas com autenticação (Supabase Auth, Auth0, NextAuth).
- Para pagamentos (se necessário), integre Stripe ou PagSeguro e não envie dados sensíveis pelo cliente diretamente sem TLS.

Se quiser, eu gero um `README_INFRA.md` separado com passos de provisionamento (Supabase + deploy no Vercel) e exemplos de migrations/queries. Quer que eu gere isso agora?
