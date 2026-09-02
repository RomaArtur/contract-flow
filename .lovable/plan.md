# Protótipo 1 — Wireframe do Sistema de Gestão de Contratos Imobiliários

Protótipo navegável de baixa/média fidelidade, em tons de cinza, com dados fictícios em memória (sem backend, sem banco). Foco em arquitetura de informação, navegação e fluxos.

## Estilo do wireframe

- Paleta neutra (cinzas + um cinza-escuro para ações primárias), tipografia de sistema, bordas visíveis, sem sombras, gradientes ou animações.
- Componentes consistentes e reutilizados: cabeçalho de página, cartão de métrica, tabela, badge de status, campo de formulário, passos (stepper), timeline, modal de confirmação, estados vazio/carregando/erro/sucesso.
- Badge de status do contrato com rótulo textual (RASCUNHO, EM_ANALISE, PRONTO_PARA_ASSINATURA, AGUARDANDO_ASSINATURAS, ASSINADO, ATIVO, ENCERRADO, CANCELADO, RECUSADO).

## Área interna (Administrador / Corretor)

Layout com navegação lateral fixa: Dashboard, Contratos, Clientes, Imóveis, Auditoria.

- **Dashboard** — orientado a "o que preciso resolver agora": contadores por etapa do ciclo de vida, lista de pendências (assinaturas atrasadas, contratos parados em análise, contratos próximos do vencimento) com link direto ao contrato.
- **Contratos (lista)** — busca, filtros (status, período, imóvel, parte), tabela com número, imóvel, locatário, status, início, término, última atualização; linha abre os detalhes. Inclui estado vazio e estado de carregamento.
- **Novo contrato** — fluxo em 5 etapas com stepper: Imóvel (selecionar existente ou criar novo com CEP → endereço preenchido/confirmado), Partes (locador, locatário, fiador, cônjuge do fiador, testemunhas, representante legal — agrupados por papel), Garantia (uma modalidade; o formulário muda conforme a escolha), Condições comerciais (aluguel, vencimento, índice e periodicidade de reajuste, condomínio, IPTU, multa moratória, juros, multa rescisória, prazo), Revisão (resumo completo + voltar para qualquer etapa + confirmação antes de enviar para análise).
- **Detalhe do contrato** — cabeçalho com número, imóvel, status e ações condicionadas ao status (ações incompatíveis não aparecem; destrutivas pedem confirmação). Abas internas:
  - Visão geral: informações gerais, imóvel, resumo de garantia e condições.
  - Partes: participantes por papel.
  - Condições: condições comerciais e garantia detalhadas.
  - Documentos: versões (versão, data de geração, status, hash, visualizar, baixar) mostrando que uma alteração gera nova versão.
  - Assinaturas: signatário, papel, status, data, pendências.
  - Histórico: timeline da evolução do contrato.
- **Clientes** e **Imóveis** — listas simples com busca e tela de detalhe enxuta (contratos vinculados).
- **Auditoria** — tabela (usuário, ação, entidade, registro, data/hora) e painel de detalhe do evento com dados anteriores, dados posteriores, IP e user-agent.

## Área do cliente

Rota separada, sem navegação administrativa: lista dos contratos do cliente, visualização do documento, conferência das informações principais, fluxo de assinatura (revisão → confirmar → sucesso), acompanhamento de status e acesso ao documento final quando assinado.

## Detalhes técnicos

- TanStack Start com rotas de arquivo: `/` (dashboard), `/contratos`, `/contratos/novo`, `/contratos/$id` com abas, `/clientes`, `/clientes/$id`, `/imoveis`, `/imoveis/$id`, `/auditoria`, `/portal`, `/portal/$id`.
- Layout administrativo compartilhado com sidebar; área do cliente usa layout próprio.
- Dados fictícios em `src/data/*` (contratos, clientes, imóveis, versões de documento, assinaturas, histórico, auditoria) tipados em TypeScript; estado do formulário de criação em memória.
- Tokens semânticos neutros em `src/styles.css`; sem cores fixas nos componentes.
- `head()` com título e descrição próprios em cada rota de conteúdo.
