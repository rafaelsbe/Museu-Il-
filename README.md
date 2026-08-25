# Museu Vivo — Ilè Asè Alaketù Oyá Igbalè

Site institucional do **Ilè Asè Alaketù Oyá Igbalè**, um museu vivo de memória, acolhimento e educação sobre a cultura afro-brasileira, localizado em Aracaju (SE). O projeto foi construído com Next.js (App Router) e usa Supabase como backend para conteúdo dinâmico (áreas do acervo, mídia) e para o agendamento de consultas.

🔗 Deploy: [museu-ile.vercel.app](https://museu-ile.vercel.app)

## Sobre o projeto

O site apresenta a instituição ao público e oferece:

- **Página inicial** com destaques, agenda, galeria, depoimentos e redes sociais (`Header`, `QuickLinks`, `Agenda`, `Gallery`, `Testimonials`, `KioskSocial`, `Featured`).
- **Sobre** — história e propósito do museu.
- **Visite** — horários, endereço e informações de acessibilidade.
- **Programação** — eventos e encontros (rodas de conversa, visitas mediadas, oficinas).
- **Acervo** — coleções do museu (objetos de axé, vestuário, arquivo oral).
- **Áreas** (`/areas` e `/areas/[area]`) — seções do acervo carregadas dinamicamente do Supabase.
- **Educação** — programas para escolas e educadores.
- **Consultas** (`/consultas`) — formulário público para agendamento de consultas, com valor fixo (R$ 200) e integração com o backend.

## Stack técnica

| Camada | Tecnologia |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| UI | React 19 + Tailwind CSS 4 |
| Ícones | lucide-react |
| Fontes | Playfair Display, Montserrat e Dancing Script (via `next/font/google`) |
| Backend/Dados | [Supabase](https://supabase.com) (Postgres + Auth + Storage) via `@supabase/ssr` e `@supabase/supabase-js` |
| Linguagem | TypeScript |
| Lint | ESLint 9 (`eslint-config-next`) |

## Estrutura do projeto

```
src/
├── app/
│   ├── page.tsx                # Home
│   ├── layout.tsx              # Layout raiz (fontes, Navbar, Footer, metadata)
│   ├── sobre/page.tsx
│   ├── visite/page.tsx
│   ├── programacao/page.tsx
│   ├── educacao/page.tsx
│   ├── acervo/page.tsx
│   ├── consultas/page.tsx      # Formulário de agendamento (client component)
│   ├── areas/
│   │   ├── page.tsx            # Lista de áreas
│   │   └── [area]/page.tsx     # Detalhe de uma área
│   └── api/
│       ├── areas/route.ts          # GET: lista áreas publicadas
│       ├── areas/[area]/route.ts   # GET: detalhe de uma área + mídia
│       └── consultas/route.ts      # GET: preço da consulta / POST: cria solicitação
├── components/                 # Header, Navbar, Footer, Agenda, Gallery, Testimonials, etc.
│   └── ui/                     # DottedPattern, PillButton, SectionHeading
├── lib/utils.ts
├── utils/supabase/
│   ├── client.ts                # Cliente Supabase (browser)
│   ├── server.ts                # Cliente Supabase (server, com cookies)
│   └── middleware.ts            # Atualização de sessão
├── proxy.ts                     # Middleware do Next.js que chama updateSession
└── assets/                      # Imagens e mídia estática

supabase/
└── schema.sql                   # Schema do banco (areas, collections, items, events, media, consultation_requests)
```

## Modelo de dados (Supabase)

O arquivo `supabase/schema.sql` define as tabelas principais:

- **`areas`** — seções do acervo (slug, título, descrição, cor, ordem, publicação).
- **`collections`** — coleções vinculadas a uma área.
- **`items`** — peças/itens de uma coleção.
- **`events`** — eventos da programação (data, local, capacidade, status).
- **`media`** — imagens vinculadas a um item, área ou evento (com legenda e créditos).
- **`consultation_requests`** — pedidos de consulta enviados pelo formulário público.

O schema inclui:
- `updated_at` automático via trigger (`set_updated_at`).
- Normalização e validação do formulário de consultas via trigger (`normalize_consultation_request`), que sempre força `price_cents = 20000`, `status = 'pending'` e impede datas retroativas — o preço e o status **nunca** podem ser definidos pelo cliente.
- **Row Level Security (RLS)** habilitada em todas as tabelas, com políticas de leitura pública apenas para conteúdo `is_published = true`.

## Como rodar localmente

### Pré-requisitos
- Node.js
- Um projeto Supabase (para as funcionalidades dinâmicas de áreas e consultas)

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=sua-url-do-projeto-supabase
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica-supabase
```

### 3. Aplicar o schema no Supabase

Rode o conteúdo de `supabase/schema.sql` no SQL Editor do seu projeto Supabase para criar as tabelas, triggers e políticas de RLS.

### 4. Rodar o servidor de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### Outros scripts

```bash
npm run build   # build de produção
npm run start   # inicia o servidor de produção
npm run lint    # executa o ESLint
```

## API interna

| Rota | Método | Descrição |
|---|---|---|
| `/api/areas` | `GET` | Lista as áreas publicadas (slug, título, descrição, cor) |
| `/api/areas/[area]` | `GET` | Detalhe de uma área publicada, incluindo mídia associada |
| `/api/consultas` | `GET` | Retorna o valor atual da consulta |
| `/api/consultas` | `POST` | Cria uma solicitação de consulta (nome, e-mail, data futura, observações) |

## Deploy

O projeto está preparado para deploy na [Vercel](https://vercel.com), com as variáveis de ambiente do Supabase configuradas no painel do projeto. Lembre-se de:

- Usar HTTPS em produção.
- Proteger rotas administrativas (ainda não implementadas neste repositório) com autenticação, caso sejam adicionadas.
- Manter as chaves do Supabase como variáveis de ambiente, nunca versionadas.

## Status

Projeto em desenvolvimento inicial: as páginas de conteúdo institucional (Sobre, Educação, Acervo, Programação) ainda contêm textos de exemplo/placeholder a serem substituídos pelo conteúdo real do museu.