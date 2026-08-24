# Auditoria técnica e de produto

Data: 23/08/2026
Escopo: aplicação Next.js em `src/app`, componentes compartilhados, APIs, configuração e dependências declaradas.

## Resumo executivo

O projeto é um protótipo editorial funcional, não uma aplicação full stack pronta para produção. A interface possui uma identidade coerente de museu cultural, mas várias páginas ainda exibem conteúdo de preenchimento e ações sem integração real. Não foram encontrados banco de dados, autenticação, autorização, camada de serviços, repositórios, migrations ou persistência durável.

As prioridades são:

- **Crítica:** não liberar o agendamento para produção sem persistência durável, controle de acesso administrativo, proteção contra abuso e política de retenção dos dados pessoais.
- **Alta:** substituir conteúdo placeholder, configurar destinos reais, criar testes de API e adicionar observabilidade.
- **Média:** consolidar componentes de página, metadados por rota, estados de carregamento mais ricos e revisão visual responsiva.
- **Baixa:** polimento visual, revisão de textos, ícones sociais via biblioteca e páginas legais dedicadas.

## Alterações aplicadas

- Validação server-side de nome, e-mail, data real e data não passada em `POST /api/consultas`.
- Preço da consulta fixado no servidor; o cliente não pode alterá-lo.
- Erros da API retornam `422` com mensagem de validação sem expor exceções internas.
- Formulário com `id` acessível, `name`, autocomplete e data mínima.
- Metadados globais reais de título e descrição.
- Remoção do `main` duplicado na home; o landmark é controlado pelo layout global.
- Links `#` substituídos por rotas existentes ou âncoras internas.
- Menu mobile com `aria-expanded`, `aria-controls` e label que reflete o estado.

## Inventário página por página

### `/`

**Problemas:** home muito longa e com muitos blocos; agenda, galeria, depoimentos e kiosque usam dados estáticos; alguns textos são genéricos; carrosséis não têm controles visíveis/estado anunciado de forma completa.

**UX/UI:** boa identidade visual, mas há excesso de seções e contraste variável sobre imagens. A ação principal da visita não fica tão clara quanto a navegação.

**Deve permanecer:** hero com fotografia, identidade tipográfica, agenda, acervo e chamada para visita.

**Reorganizar:** priorizar visita, agenda e acervo acima de conteúdos institucionais secundários; reduzir blocos repetidos.

**Adicionar:** dados reais, alt text revisado, estados de erro/loading e métricas de navegação.

**Prioridade:** Alta.

### `/sobre`

**Problemas:** texto explicitamente provisório e ausência de dados históricos reais.

**UX/UI:** estrutura editorial simples e adequada; os três cartões podem virar uma narrativa com evidências e imagens.

**Deve permanecer:** divisão entre apresentação e valores do museu.

**Reorganizar:** substituir abstrações por cronologia, pessoas e fontes autorizadas.

**Prioridade:** Alta, por conteúdo e confiança institucional.

### `/areas` e `/areas/[area]`

**Problemas:** a lista busca API sem tipagem/contrato compartilhado; detalhes exibem imagens de `/images/*.jpg` que não aparecem no inventário informado; história é placeholder.

**UX/UI:** cards funcionam para exploração, mas estados de loading/vazio são textos simples e não oferecem retry.

**Deve permanecer:** quatro áreas como eixo de navegação.

**Reorganizar:** mover dados para um serviço/repositório quando houver banco ou CMS; usar `Link` do Next; validar slug e conteúdo no servidor.

**Adicionar:** not-found dedicado, imagens reais, créditos, conteúdo acessível e testes de contrato.

**Prioridade:** Alta.

### `/acervo`

**Problemas:** três coleções estáticas sem detalhe, busca, filtros, créditos ou inventário real; texto diz que o conteúdo ainda será adicionado.

**Deve permanecer:** agrupamento por coleção.

**Reorganizar:** catálogo com metadados mínimos: título, tipo, data/período, origem, direitos e descrição.

**Prioridade:** Alta.

### `/programacao`

**Problemas:** eventos são placeholders; não há datas, disponibilidade, detalhe ou integração com a agenda da home.

**Deve permanecer:** entrada única para atividades.

**Reorganizar:** modelo de evento compartilhado entre página, home e futura API.

**Adicionar:** timezone, cancelamento, inscrição e estado vazio real.

**Prioridade:** Alta.

### `/educacao`

**Problemas:** materiais educativos não existem; o CTA leva a visita em vez de um fluxo de reserva educacional.

**Deve permanecer:** foco em escolas e educadores.

**Reorganizar:** separar visita escolar, materiais e oficinas, com público e duração explícitos.

**Prioridade:** Média.

### `/visite`

**Problemas:** informações de contato e acessibilidade são incompletas; CTA de consulta não é equivalente a ingresso/visita; âncoras legais ainda não têm seções dedicadas.

**Deve permanecer:** horário, endereço e acessibilidade como primeira informação.

**Reorganizar:** incluir mapa, transporte, política de fotografias, recursos de acessibilidade e canal de contato real.

**Prioridade:** Alta.

### `/consultas`

**Problemas críticos:** antes da correção, aceitava payload arbitrário, confiava no preço enviado pelo cliente e mantinha dados apenas em memória. Ainda falta persistência, confirmação de disponibilidade, proteção contra spam, consentimento LGPD e painel seguro.

**Deve permanecer:** solicitação simples com retorno assíncrono.

**Reorganizar:** transformar em solicitação de horário, não confirmação de agendamento, até existir disponibilidade transacional.

**Prioridade:** Crítica para produção; o contrato básico foi endurecido nesta auditoria.

### APIs

- `GET /api/areas`: dados estáticos; adequado apenas para protótipo.
- `GET /api/areas/[area]`: retorna `404` corretamente para slug desconhecido, mas referencia assets não confirmados.
- `GET/POST /api/consultas`: mock volátil, sem autenticação, rate limit, banco, schema compartilhado ou logs estruturados. O `GET` expõe todos os pedidos e deve ser protegido/removido antes de produção.

## Arquitetura recomendada

### Frontend

```text
src/
  app/                 # rotas e layouts finos
  components/          # componentes de domínio e apresentação
  components/ui/       # primitives acessíveis
  features/
    areas/
    acervo/
    agenda/
    consultas/
  lib/
    api/
    validation/
    formatters/
  types/               # contratos compartilhados
  assets/
```

As páginas devem consumir funções de `lib/api` ou server components, evitando fetch client-side para dados que podem ser obtidos no servidor. Formulários client-side devem compartilhar schema com a API.

### Backend

```text
src/server/
  routes/
  controllers/
  services/
  repositories/
  validators/
  middleware/
  config/
```

Para este porte, não é necessário criar todas as camadas imediatamente. O primeiro passo é um serviço de consultas com schema, repository PostgreSQL, auditoria e autorização para leitura administrativa.

### Banco recomendado

PostgreSQL gerenciado, com migrations. Tabelas iniciais:

- `consultation_requests`: id, nome, email, data solicitada, observações, preço vigente, status, timestamps.
- `events`: título, descrição, início, fim, local, capacidade, status.
- `areas`, `collections`, `items`, `media`: conteúdo editorial e créditos.

Índices iniciais: `consultation_requests(status, requested_date)`, `events(start_at, status)` e slugs únicos. Dados pessoais devem ter retenção definida e acesso administrativo auditado.

## Segurança e operação

- Não há secrets ou banco no código examinado.
- Falta autenticação/autorização porque não existe área administrativa.
- O endpoint de consultas precisa de rate limiting, CAPTCHA ou proteção equivalente, validação de tamanho de campos, CSRF conforme a estratégia de autenticação e logs sem dados sensíveis.
- CORS não está customizado; manter same-origin por padrão.
- Configurar headers de segurança, HTTPS, CSP revisada, HSTS em produção e política de privacidade real.
- Executar `npm audit` em ambiente com certificado/registry funcional; a tentativa desta auditoria falhou com erro de certificado (`certificate is not yet valid`), portanto não é evidência de que as dependências estejam livres de vulnerabilidades.

## Performance, acessibilidade e qualidade

Pontos positivos: `next/image`, `next/font`, `prefers-reduced-motion`, skip link e `:focus-visible` já existem.

Próximas melhorias: não carregar imagens externas sem necessidade, adicionar dimensões/alt text auditados, reduzir prioridade a uma imagem hero, testar teclado/leitor de tela, substituir `href` nativo por `Link` em navegação interna, criar testes para as rotas e usar monitoramento de erros.

## Validação executada

- `npm run lint`: passou.
- `npm run build`: passou; 13 páginas/rotas foram compiladas.
- Diagnósticos do editor nos arquivos alterados: nenhum erro.
- `npm audit --omit=dev`: bloqueado pelo erro de certificado do registry.

## Plano de evolução

1. Definir conteúdo aprovado, direitos de imagem e requisitos de visita.
2. Criar schema PostgreSQL e migration para eventos, áreas, acervo e consultas.
3. Implementar validação compartilhada e repository de consultas.
4. Proteger leitura administrativa e adicionar rate limiting, consentimento e retenção.
5. Substituir placeholders e integrar agenda/acervo em uma fonte única.
6. Adicionar testes de API, acessibilidade e fluxos críticos em desktop e mobile.
