# fcs-web

Interface web da plataforma **Conexão Solidária**, criada para apoiar o MVP da ONG **Esperança Solidária** com cadastro de **Doador**, autenticação, painel público de transparência, fluxo de doação e operação administrativa por **GestorONG**.

Este repositório representa o cliente web da solução. As regras de negócio, autenticação, campanhas e doações ficam nas APIs do ecossistema Fase 05; o frontend consome essas APIs e mantém o vocabulário de domínio documentado em `docs/`.

## Contexto da solução

A Conexão Solidária conecta doadores a campanhas de arrecadação administradas por uma ONG. A arquitetura confirmada para a Fase 05 usa microsserviços, JWT/RBAC, Kafka, auditoria centralizada e infraestrutura Kubernetes/Azure.

Aplicações relacionadas:

- `fcs-identity`: fachada de identidade, login, refresh, cadastro de **Doador** e perfil `/me`.
- `fcs-campaigns`: gestão de campanhas e painel público de transparência.
- `fcs-donations`: recebimento de intenções de doação.
- `fcs-donation-worker`: processamento assíncrono de doações via Kafka.
- `fcs-audit-logs`: consumo e persistência de auditoria em MongoDB.
- `fcs-solidarity-infra`: ambiente integrado, Kubernetes, observabilidade e Azure.

## Responsabilidade do frontend

O `fcs-web` deve concentrar a experiência de uso da plataforma:

- Exibir o **Painel de Transparência** com campanhas ativas e valores arrecadados.
- Permitir cadastro e login de **Doador** usando a `fcs-identity`.
- Permitir que um **Doador** autenticado envie uma **Intenção de Doação** para uma campanha ativa.
- Permitir que um **Doador** acompanhe suas próprias doações.
- Permitir que um **GestorONG** acesse fluxos administrativos de campanhas.
- Tratar erros das APIs no envelope `ApiResponse<T>` adotado pelos serviços.

O cliente não deve chamar o Keycloak diretamente. Toda autenticação passa pela `fcs-identity`, conforme as decisões de arquitetura.

## Stack

- Angular 21
- TypeScript 5.9
- PrimeNG 21
- Tailwind CSS 4
- Vitest para testes unitários
- ESLint, Prettier, Husky e lint-staged

Padrões locais:

- Componentes standalone.
- Signals para estado local.
- Rotas lazy quando features forem adicionadas.
- Templates com `@if`, `@for` e `@switch`.
- Injeção com `inject()`.
- Acessibilidade seguindo WCAG AA.

## Fluxos esperados

### Público

- Consultar campanhas ativas em `GET /api/v1/transparency/campaigns`.
- Cadastrar **Doador** em `POST /api/v1/auth/register/donor`.
- Realizar login em `POST /api/v1/auth/login`.

### Doador

- Consultar perfil em `GET /api/v1/me`.
- Criar intenção de doação em `POST /api/v1/donations`.
- Listar doações em `GET /api/v1/donations`.
- Consultar detalhe de doação em `GET /api/v1/donations/{id}`.

### GestorONG

- Consultar perfil em `GET /api/v1/me`.
- Criar campanha em `POST /api/v1/campaigns`.
- Editar campanha em `PUT /api/v1/campaigns/{id}`.
- Alterar status de campanha em `PATCH /api/v1/campaigns/{id}/status`.
- Listar e consultar campanhas administrativas em `GET /api/v1/campaigns`.
- Acompanhar doações conforme autorização da API.

## Requisitos

- Node.js compatível com Angular 21.
- npm 11.
- APIs da plataforma em execução localmente ou em ambiente integrado.

Instale as dependências:

```bash
npm install
```

## Execução local

Suba o servidor de desenvolvimento:

```bash
npm start
```

A aplicação fica disponível em:

```text
http://localhost:4200
```

## Qualidade

Rodar testes unitários:

```bash
npm run test:ci
```

Rodar lint:

```bash
npm run lint
```

Verificar formatação:

```bash
npm run format:check
```

Executar a verificação completa:

```bash
npm run verify
```

O comando `verify` executa formatação, lint, testes unitários e build de produção.

## Build

Gerar build de produção:

```bash
npm run build
```

Os artefatos são publicados em `dist/`.

## Integração com as APIs

As APIs seguem o envelope `ApiResponse<T>`:

```json
{
  "success": true,
  "data": {},
  "errorMessages": null
}
```

Erros retornam `success: false`, `data: null` e uma lista em `errorMessages`.

Rotas públicas de negócio usam o prefixo:

```text
/api/v1
```

Rotas operacionais e internas não devem ser expostas ao usuário final:

```text
/health
/metrics
/internal/*
```

## Segurança

- JWT emitido pelo Keycloak e obtido via `fcs-identity`.
- Roles canônicas: `Doador` e `GestorONG`.
- Validação de JWT e RBAC permanece nas APIs.
- O frontend deve usar a role apenas para experiência de navegação, nunca como única barreira de segurança.
- Segredos, URLs sensíveis e tokens reais não devem ser versionados.

## Referências

Documentação de arquitetura no workspace principal:

- `docs/CONTEXT.md`
- `docs/architecture/overview.md`
- `docs/architecture/endpoints.md`
- `docs/architecture/endpoint-flows.md`
- `docs/adr/0001-keycloak-behind-identity-api.md`
- `docs/adr/0022-reuse-fcs-pipelines-for-ci-cd.md`
