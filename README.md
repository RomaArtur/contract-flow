# Contract Flow

Protótipo 1 — Wireframe do Sistema de Gestão de Contratos Imobiliários

Objetivo

Criar um protótipo navegável de baixa/média fidelidade para validar a estrutura, os fluxos e a organização das telas de um sistema web focado na gestão de contratos de locação imobiliária.

Neste primeiro protótipo, NÃO priorizar identidade visual, branding ou estética avançada. O objetivo é validar arquitetura de informação, hierarquia, navegação, conteúdo e experiência de uso.

Personas

Existem duas personas:

Administrador / Corretor

Usuário interno da imobiliária.

Gerencia clientes, imóveis e contratos.

Cria, revisa, acompanha e gerencia contratos.

Cliente

Participa de um contrato.

Visualiza documentos.

Realiza assinaturas.

Consulta o status e acessa o documento final.

Conceito central do produto

O sistema é centrado em CONTRATOS.

O contrato é o principal elemento da aplicação e possui ciclo de vida próprio:

RASCUNHO
→ EM_ANALISE
→ PRONTO_PARA_ASSINATURA
→ AGUARDANDO_ASSINATURAS
→ ASSINADO
→ ATIVO
→ ENCERRADO

Também podem existir os estados:

CANCELADO
RECUSADO

Estrutura principal do sistema

Para o Administrador / Corretor:

Dashboard

Contratos

Clientes

Imóveis

Auditoria

A área de Contratos é o núcleo da aplicação.

Dashboard

O dashboard deve ser orientado à operação dos contratos.

Priorizar informações como:

Contratos em rascunho

Contratos em análise

Contratos prontos para assinatura

Contratos aguardando assinaturas

Contratos assinados

Contratos ativos

Contratos próximos de alguma ação necessária

Pendências que exigem atenção

Evitar transformar o dashboard em um CRM genérico.

A principal pergunta do dashboard deve ser:

"O que eu preciso resolver agora?"

Lista de contratos

Criar uma tela de listagem com:

Busca

Filtros

Status

Período

Imóvel

Parte do contrato

A tabela deve apresentar informações como:

Número do contrato

Imóvel

Locatário

Status

Data de início

Data de término

Última atualização

Permitir abrir os detalhes do contrato.

Criação do contrato

Criar um fluxo dividido em etapas:

Imóvel

Partes

Garantia

Condições comerciais

Revisão

Imóvel

Permitir:

Selecionar imóvel existente

Criar novo imóvel

Informar CEP

Preencher endereço

Confirmar/complementar endereço

Partes

Permitir adicionar:

Locador

Locatário

Fiador

Cônjuge do fiador quando aplicável

Testemunhas

Representante legal quando aplicável

Os participantes devem ser apresentados por papel.

Garantia

Permitir selecionar somente uma modalidade:

Caução em dinheiro

Caução em bem

Fiança

Seguro fiança

Cessão fiduciária

Sem garantia

A interface deve mudar dinamicamente conforme a garantia escolhida.

Condições comerciais

Campos principais:

Valor do aluguel

Dia do vencimento

Índice de reajuste

Periodicidade do reajuste

Condomínio

IPTU

Multa moratória

Juros de mora

Multa rescisória

Prazo contratual

Revisão

Mostrar um resumo completo antes do envio para análise.

Permitir voltar para qualquer etapa e corrigir informações.

Detalhes do contrato

Criar uma tela central para visualizar:

Informações gerais

Status

Imóvel

Partes

Garantia

Condições comerciais

Documentos

Assinaturas

Histórico

As ações disponíveis devem depender do status atual do contrato.

Documentos

Criar uma área para visualizar as versões do documento:

Versão

Data de geração

Status

Hash

Visualização

Download

Demonstrar visualmente que uma nova alteração no contrato gera uma nova versão documental.

Assinaturas

Mostrar:

Signatários

Papel de cada signatário

Status da assinatura

Data da assinatura

Pendências

Exemplo:

Locador — Assinado
Locatário — Pendente
Fiador — Assinado
Testemunha 1 — Assinado
Testemunha 2 — Assinado

Histórico

Criar uma timeline mostrando a evolução do contrato.

Exemplo:

Contrato criado
→ Submetido para análise
→ Aprovado
→ Documento gerado
→ Enviado para assinatura
→ Locador assinou
→ Locatário assinou
→ Contrato assinado
→ Contrato ativado

Auditoria

Criar uma tela separada para rastreabilidade técnica.

Mostrar:

Usuário

Ação

Entidade

Registro

Data/hora

Ao abrir um evento, mostrar também informações como:

Dados anteriores

Dados posteriores

IP

User-Agent

Área do cliente

Criar uma experiência extremamente simplificada.

O cliente deve conseguir:

Acessar o contrato

Visualizar o documento

Conferir informações

Assinar

Acompanhar o status

Acessar o documento final

Não apresentar ao cliente o dashboard administrativo, clientes, imóveis ou auditoria.

Navegação

Criar uma navegação lateral para o usuário interno:

Dashboard
Contratos
Clientes
Imóveis
Auditoria

O contrato deve possuir navegação interna por seções ou abas:

Visão geral
Partes
Condições
Documentos
Assinaturas
Histórico

Regras de UX

Priorizar clareza sobre estética.

Não inventar funcionalidades que não foram especificadas.

Utilizar componentes consistentes.

Utilizar estados de loading, vazio, erro e sucesso.

Utilizar confirmações para ações destrutivas.

A interface deve deixar claro o status atual do contrato.

Ações incompatíveis com o estado atual devem ficar indisponíveis ou não aparecer.

Evitar formulários gigantes.

Utilizar etapas quando houver grande quantidade de informações.

Sempre permitir revisão antes de ações críticas.

Escopo deste protótipo

Este protótipo deve validar:

Arquitetura de informação

Navegação

Fluxos

Hierarquia das informações

Estrutura dos formulários

Organização dos detalhes do contrato

Jornada do cliente

NÃO desenvolver ainda um Design System visual completo.

NÃO definir identidade visual definitiva.

NÃO utilizar animações ou efeitos visuais desnecessários.

O resultado deve parecer um wireframe/protótipo funcional de produto, não uma interface final de produção.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a64849c6-c297-4f42-b302-9ba0e7b9d3e9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
