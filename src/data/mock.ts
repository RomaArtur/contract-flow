export type ContractStatus =
  | "RASCUNHO"
  | "EM_ANALISE"
  | "PRONTO_PARA_ASSINATURA"
  | "AGUARDANDO_ASSINATURAS"
  | "ASSINADO"
  | "ATIVO"
  | "ENCERRADO"
  | "CANCELADO"
  | "RECUSADO";

export const STATUS_ORDER: ContractStatus[] = [
  "RASCUNHO",
  "EM_ANALISE",
  "PRONTO_PARA_ASSINATURA",
  "AGUARDANDO_ASSINATURAS",
  "ASSINADO",
  "ATIVO",
  "ENCERRADO",
  "CANCELADO",
  "RECUSADO",
];

export const STATUS_LABEL: Record<ContractStatus, string> = {
  RASCUNHO: "Rascunho",
  EM_ANALISE: "Em análise",
  PRONTO_PARA_ASSINATURA: "Pronto para assinatura",
  AGUARDANDO_ASSINATURAS: "Aguardando assinaturas",
  ASSINADO: "Assinado",
  ATIVO: "Ativo",
  ENCERRADO: "Encerrado",
  CANCELADO: "Cancelado",
  RECUSADO: "Recusado",
};

export type PartyRole =
  "LOCADOR" | "LOCATARIO" | "FIADOR" | "CONJUGE_FIADOR" | "TESTEMUNHA" | "REPRESENTANTE_LEGAL";

export const ROLE_LABEL: Record<PartyRole, string> = {
  LOCADOR: "Locador",
  LOCATARIO: "Locatário",
  FIADOR: "Fiador",
  CONJUGE_FIADOR: "Cônjuge do fiador",
  TESTEMUNHA: "Testemunha",
  REPRESENTANTE_LEGAL: "Representante legal",
};

export type GuaranteeType =
  | "CAUCAO_DINHEIRO"
  | "CAUCAO_BEM"
  | "FIANCA"
  | "SEGURO_FIANCA"
  | "CESSAO_FIDUCIARIA"
  | "SEM_GARANTIA";

export const GUARANTEE_LABEL: Record<GuaranteeType, string> = {
  CAUCAO_DINHEIRO: "Caução em dinheiro",
  CAUCAO_BEM: "Caução em bem",
  FIANCA: "Fiança",
  SEGURO_FIANCA: "Seguro fiança",
  CESSAO_FIDUCIARIA: "Cessão fiduciária",
  SEM_GARANTIA: "Sem garantia",
};

export type Client = {
  id: string;
  nome: string;
  documento: string;
  email: string;
  telefone: string;
  tipo: "PF" | "PJ";
};

export type Property = {
  id: string;
  codigo: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  tipo: string;
  area: string;
};

export type Party = {
  clientId: string;
  role: PartyRole;
};

export type DocumentVersion = {
  versao: string;
  geradoEm: string;
  status: string;
  hash: string;
  motivo: string;
};

export type Signature = {
  clientId: string;
  role: PartyRole;
  status: "ASSINADO" | "PENDENTE" | "RECUSADO" | "NAO_ENVIADO";
  assinadoEm?: string;
};

export type HistoryEvent = {
  data: string;
  titulo: string;
  autor: string;
  detalhe?: string;
};

export type Contract = {
  id: string;
  numero: string;
  propertyId: string;
  status: ContractStatus;
  inicio: string;
  termino: string;
  atualizadoEm: string;
  garantia: {
    tipo: GuaranteeType;
    detalhe: string;
  };
  condicoes: {
    aluguel: string;
    vencimento: string;
    indice: string;
    periodicidade: string;
    condominio: string;
    iptu: string;
    multaMoratoria: string;
    jurosMora: string;
    multaRescisoria: string;
    prazo: string;
  };
  partes: Party[];
  documentos: DocumentVersion[];
  assinaturas: Signature[];
  historico: HistoryEvent[];
  pendencia?: string;
};

export const clients: Client[] = [
  {
    id: "c1",
    nome: "Marina Alves Ribeiro",
    documento: "123.456.789-01",
    email: "marina.alves@email.com",
    telefone: "(11) 98888-1010",
    tipo: "PF",
  },
  {
    id: "c2",
    nome: "Construtora Vale Norte LTDA",
    documento: "12.345.678/0001-90",
    email: "contato@valenorte.com.br",
    telefone: "(11) 3344-5566",
    tipo: "PJ",
  },
  {
    id: "c3",
    nome: "Rogério Campos Lima",
    documento: "987.654.321-00",
    email: "rogerio.lima@email.com",
    telefone: "(11) 97777-2020",
    tipo: "PF",
  },
  {
    id: "c4",
    nome: "Helena Souza Campos",
    documento: "456.123.789-22",
    email: "helena.campos@email.com",
    telefone: "(11) 96666-3030",
    tipo: "PF",
  },
  {
    id: "c5",
    nome: "Paulo Henrique Dias",
    documento: "321.654.987-11",
    email: "paulo.dias@email.com",
    telefone: "(11) 95555-4040",
    tipo: "PF",
  },
  {
    id: "c6",
    nome: "Juliana Prado Martins",
    documento: "741.852.963-33",
    email: "juliana.prado@email.com",
    telefone: "(11) 94444-5050",
    tipo: "PF",
  },
  {
    id: "c7",
    nome: "Eduardo Nakamura",
    documento: "159.357.486-44",
    email: "eduardo.nakamura@email.com",
    telefone: "(11) 93333-6060",
    tipo: "PF",
  },
];

export const properties: Property[] = [
  {
    id: "p1",
    codigo: "IM-0001",
    cep: "01310-100",
    logradouro: "Av. Paulista",
    numero: "1500",
    complemento: "Apto 82",
    bairro: "Bela Vista",
    cidade: "São Paulo",
    uf: "SP",
    tipo: "Apartamento",
    area: "78 m²",
  },
  {
    id: "p2",
    codigo: "IM-0002",
    cep: "04543-011",
    logradouro: "Rua Olimpíadas",
    numero: "205",
    bairro: "Vila Olímpia",
    cidade: "São Paulo",
    uf: "SP",
    tipo: "Sala comercial",
    area: "120 m²",
  },
  {
    id: "p3",
    codigo: "IM-0003",
    cep: "05413-020",
    logradouro: "Rua Harmonia",
    numero: "78",
    bairro: "Vila Madalena",
    cidade: "São Paulo",
    uf: "SP",
    tipo: "Casa",
    area: "160 m²",
  },
  {
    id: "p4",
    codigo: "IM-0004",
    cep: "09015-000",
    logradouro: "Rua Sete de Setembro",
    numero: "44",
    complemento: "Loja 2",
    bairro: "Centro",
    cidade: "Santo André",
    uf: "SP",
    tipo: "Loja",
    area: "95 m²",
  },
];

function condicoes(
  aluguel: string,
  extras?: Partial<Contract["condicoes"]>,
): Contract["condicoes"] {
  return {
    aluguel,
    vencimento: "Dia 10",
    indice: "IGP-M",
    periodicidade: "Anual",
    condominio: "R$ 680,00",
    iptu: "R$ 190,00",
    multaMoratoria: "2%",
    jurosMora: "1% ao mês",
    multaRescisoria: "3 aluguéis",
    prazo: "30 meses",
    ...extras,
  };
}

export const contracts: Contract[] = [
  {
    id: "ct-2026-0142",
    numero: "CT-2026-0142",
    propertyId: "p1",
    status: "AGUARDANDO_ASSINATURAS",
    inicio: "01/09/2026",
    termino: "28/02/2029",
    atualizadoEm: "31/08/2026 18:20",
    garantia: { tipo: "FIANCA", detalhe: "Fiador com imóvel próprio em São Paulo/SP" },
    condicoes: condicoes("R$ 4.200,00"),
    partes: [
      { clientId: "c2", role: "LOCADOR" },
      { clientId: "c1", role: "LOCATARIO" },
      { clientId: "c3", role: "FIADOR" },
      { clientId: "c4", role: "CONJUGE_FIADOR" },
      { clientId: "c5", role: "TESTEMUNHA" },
      { clientId: "c6", role: "TESTEMUNHA" },
      { clientId: "c7", role: "REPRESENTANTE_LEGAL" },
    ],
    documentos: [
      {
        versao: "v3",
        geradoEm: "30/08/2026 14:02",
        status: "Vigente",
        hash: "9f2c4ab1d77e0b53",
        motivo: "Ajuste do índice de reajuste",
      },
      {
        versao: "v2",
        geradoEm: "27/08/2026 09:41",
        status: "Substituída",
        hash: "31ba77c0e2f19d48",
        motivo: "Inclusão do cônjuge do fiador",
      },
      {
        versao: "v1",
        geradoEm: "24/08/2026 16:18",
        status: "Substituída",
        hash: "0ac8d1f43b6e2290",
        motivo: "Geração inicial",
      },
    ],
    assinaturas: [
      { clientId: "c2", role: "LOCADOR", status: "ASSINADO", assinadoEm: "30/08/2026 17:05" },
      { clientId: "c1", role: "LOCATARIO", status: "PENDENTE" },
      { clientId: "c3", role: "FIADOR", status: "ASSINADO", assinadoEm: "31/08/2026 09:12" },
      { clientId: "c4", role: "CONJUGE_FIADOR", status: "PENDENTE" },
      { clientId: "c5", role: "TESTEMUNHA", status: "ASSINADO", assinadoEm: "31/08/2026 10:44" },
      { clientId: "c6", role: "TESTEMUNHA", status: "ASSINADO", assinadoEm: "31/08/2026 11:02" },
    ],
    historico: [
      { data: "24/08/2026 16:10", titulo: "Contrato criado", autor: "Corretor — Ana Duarte" },
      { data: "24/08/2026 16:18", titulo: "Documento gerado (v1)", autor: "Sistema" },
      {
        data: "26/08/2026 11:30",
        titulo: "Submetido para análise",
        autor: "Corretor — Ana Duarte",
      },
      {
        data: "27/08/2026 09:41",
        titulo: "Documento gerado (v2)",
        autor: "Sistema",
        detalhe: "Inclusão do cônjuge do fiador",
      },
      {
        data: "29/08/2026 15:22",
        titulo: "Aprovado na análise",
        autor: "Administrador — Carlos Melo",
      },
      {
        data: "30/08/2026 14:02",
        titulo: "Documento gerado (v3)",
        autor: "Sistema",
        detalhe: "Ajuste do índice de reajuste",
      },
      {
        data: "30/08/2026 14:20",
        titulo: "Enviado para assinatura",
        autor: "Administrador — Carlos Melo",
      },
      { data: "30/08/2026 17:05", titulo: "Locador assinou", autor: "Construtora Vale Norte LTDA" },
      { data: "31/08/2026 09:12", titulo: "Fiador assinou", autor: "Rogério Campos Lima" },
    ],
    pendencia: "2 assinaturas pendentes há 2 dias",
  },
  {
    id: "ct-2026-0138",
    numero: "CT-2026-0138",
    propertyId: "p2",
    status: "EM_ANALISE",
    inicio: "15/09/2026",
    termino: "14/09/2028",
    atualizadoEm: "28/08/2026 10:05",
    garantia: { tipo: "SEGURO_FIANCA", detalhe: "Apólice Porto Seguro nº 8871-2 (em validação)" },
    condicoes: condicoes("R$ 9.800,00", {
      prazo: "24 meses",
      indice: "IPCA",
      condominio: "R$ 1.450,00",
      iptu: "R$ 520,00",
    }),
    partes: [
      { clientId: "c2", role: "LOCADOR" },
      { clientId: "c6", role: "LOCATARIO" },
      { clientId: "c5", role: "TESTEMUNHA" },
      { clientId: "c7", role: "TESTEMUNHA" },
    ],
    documentos: [
      {
        versao: "v1",
        geradoEm: "27/08/2026 18:00",
        status: "Em análise",
        hash: "5b1e990ac7d4f632",
        motivo: "Geração inicial",
      },
    ],
    assinaturas: [
      { clientId: "c2", role: "LOCADOR", status: "NAO_ENVIADO" },
      { clientId: "c6", role: "LOCATARIO", status: "NAO_ENVIADO" },
      { clientId: "c5", role: "TESTEMUNHA", status: "NAO_ENVIADO" },
      { clientId: "c7", role: "TESTEMUNHA", status: "NAO_ENVIADO" },
    ],
    historico: [
      { data: "27/08/2026 17:40", titulo: "Contrato criado", autor: "Corretor — Ana Duarte" },
      { data: "27/08/2026 18:00", titulo: "Documento gerado (v1)", autor: "Sistema" },
      {
        data: "28/08/2026 10:05",
        titulo: "Submetido para análise",
        autor: "Corretor — Ana Duarte",
      },
    ],
    pendencia: "Parado em análise há 5 dias",
  },
  {
    id: "ct-2026-0131",
    numero: "CT-2026-0131",
    propertyId: "p3",
    status: "ATIVO",
    inicio: "01/03/2025",
    termino: "30/09/2026",
    atualizadoEm: "02/03/2025 08:30",
    garantia: {
      tipo: "CAUCAO_DINHEIRO",
      detalhe: "R$ 15.000,00 depositados em conta poupança vinculada",
    },
    condicoes: condicoes("R$ 5.000,00", { prazo: "18 meses", vencimento: "Dia 5" }),
    partes: [
      { clientId: "c3", role: "LOCADOR" },
      { clientId: "c5", role: "LOCATARIO" },
      { clientId: "c1", role: "TESTEMUNHA" },
      { clientId: "c6", role: "TESTEMUNHA" },
    ],
    documentos: [
      {
        versao: "v2",
        geradoEm: "01/03/2025 12:00",
        status: "Vigente",
        hash: "aa41d0c8e7b32f19",
        motivo: "Documento final assinado",
      },
      {
        versao: "v1",
        geradoEm: "20/02/2025 09:15",
        status: "Substituída",
        hash: "77c2ba09e5d81346",
        motivo: "Geração inicial",
      },
    ],
    assinaturas: [
      { clientId: "c3", role: "LOCADOR", status: "ASSINADO", assinadoEm: "28/02/2025 10:00" },
      { clientId: "c5", role: "LOCATARIO", status: "ASSINADO", assinadoEm: "28/02/2025 15:31" },
      { clientId: "c1", role: "TESTEMUNHA", status: "ASSINADO", assinadoEm: "28/02/2025 16:02" },
      { clientId: "c6", role: "TESTEMUNHA", status: "ASSINADO", assinadoEm: "28/02/2025 16:20" },
    ],
    historico: [
      { data: "18/02/2025 14:00", titulo: "Contrato criado", autor: "Corretor — Ana Duarte" },
      { data: "20/02/2025 09:15", titulo: "Documento gerado (v1)", autor: "Sistema" },
      {
        data: "22/02/2025 11:00",
        titulo: "Aprovado na análise",
        autor: "Administrador — Carlos Melo",
      },
      { data: "25/02/2025 09:00", titulo: "Enviado para assinatura", autor: "Sistema" },
      { data: "28/02/2025 16:20", titulo: "Contrato assinado", autor: "Sistema" },
      { data: "01/03/2025 12:00", titulo: "Contrato ativado", autor: "Sistema" },
    ],
    pendencia: "Vence em 29 dias — avaliar renovação",
  },
  {
    id: "ct-2026-0145",
    numero: "CT-2026-0145",
    propertyId: "p4",
    status: "RASCUNHO",
    inicio: "01/10/2026",
    termino: "30/09/2029",
    atualizadoEm: "01/09/2026 19:44",
    garantia: { tipo: "SEM_GARANTIA", detalhe: "Sem garantia definida" },
    condicoes: condicoes("R$ 3.100,00", {
      prazo: "36 meses",
      condominio: "Não há",
      iptu: "R$ 140,00",
    }),
    partes: [
      { clientId: "c2", role: "LOCADOR" },
      { clientId: "c7", role: "LOCATARIO" },
    ],
    documentos: [],
    assinaturas: [],
    historico: [
      { data: "01/09/2026 19:44", titulo: "Contrato criado", autor: "Corretor — Ana Duarte" },
    ],
    pendencia: "Rascunho incompleto — faltam garantia e testemunhas",
  },
  {
    id: "ct-2026-0140",
    numero: "CT-2026-0140",
    propertyId: "p1",
    status: "PRONTO_PARA_ASSINATURA",
    inicio: "10/09/2026",
    termino: "09/09/2028",
    atualizadoEm: "30/08/2026 16:10",
    garantia: {
      tipo: "CESSAO_FIDUCIARIA",
      detalhe: "Cessão fiduciária de aplicação financeira — R$ 22.000,00",
    },
    condicoes: condicoes("R$ 4.500,00", { prazo: "24 meses" }),
    partes: [
      { clientId: "c3", role: "LOCADOR" },
      { clientId: "c4", role: "LOCATARIO" },
      { clientId: "c1", role: "TESTEMUNHA" },
      { clientId: "c5", role: "TESTEMUNHA" },
    ],
    documentos: [
      {
        versao: "v1",
        geradoEm: "30/08/2026 16:10",
        status: "Vigente",
        hash: "e01f7b3c92da4856",
        motivo: "Geração inicial",
      },
    ],
    assinaturas: [
      { clientId: "c3", role: "LOCADOR", status: "NAO_ENVIADO" },
      { clientId: "c4", role: "LOCATARIO", status: "NAO_ENVIADO" },
      { clientId: "c1", role: "TESTEMUNHA", status: "NAO_ENVIADO" },
      { clientId: "c5", role: "TESTEMUNHA", status: "NAO_ENVIADO" },
    ],
    historico: [
      { data: "28/08/2026 10:00", titulo: "Contrato criado", autor: "Corretor — Ana Duarte" },
      {
        data: "29/08/2026 09:30",
        titulo: "Submetido para análise",
        autor: "Corretor — Ana Duarte",
      },
      {
        data: "30/08/2026 15:50",
        titulo: "Aprovado na análise",
        autor: "Administrador — Carlos Melo",
      },
      { data: "30/08/2026 16:10", titulo: "Documento gerado (v1)", autor: "Sistema" },
    ],
    pendencia: "Pronto para envio de assinaturas",
  },
  {
    id: "ct-2026-0120",
    numero: "CT-2026-0120",
    propertyId: "p4",
    status: "ASSINADO",
    inicio: "05/09/2026",
    termino: "04/09/2028",
    atualizadoEm: "29/08/2026 12:12",
    garantia: {
      tipo: "CAUCAO_BEM",
      detalhe: "Veículo — Toyota Corolla 2022, avaliado em R$ 98.000,00",
    },
    condicoes: condicoes("R$ 2.700,00", { prazo: "24 meses" }),
    partes: [
      { clientId: "c2", role: "LOCADOR" },
      { clientId: "c5", role: "LOCATARIO" },
      { clientId: "c6", role: "TESTEMUNHA" },
      { clientId: "c7", role: "TESTEMUNHA" },
    ],
    documentos: [
      {
        versao: "v2",
        geradoEm: "29/08/2026 12:12",
        status: "Vigente",
        hash: "b93c012ffa7e6d41",
        motivo: "Documento final assinado",
      },
      {
        versao: "v1",
        geradoEm: "22/08/2026 08:55",
        status: "Substituída",
        hash: "10de44b7c9a02f38",
        motivo: "Geração inicial",
      },
    ],
    assinaturas: [
      { clientId: "c2", role: "LOCADOR", status: "ASSINADO", assinadoEm: "28/08/2026 14:00" },
      { clientId: "c5", role: "LOCATARIO", status: "ASSINADO", assinadoEm: "29/08/2026 10:10" },
      { clientId: "c6", role: "TESTEMUNHA", status: "ASSINADO", assinadoEm: "29/08/2026 11:30" },
      { clientId: "c7", role: "TESTEMUNHA", status: "ASSINADO", assinadoEm: "29/08/2026 12:00" },
    ],
    historico: [
      { data: "20/08/2026 09:00", titulo: "Contrato criado", autor: "Corretor — Ana Duarte" },
      { data: "22/08/2026 08:55", titulo: "Documento gerado (v1)", autor: "Sistema" },
      {
        data: "25/08/2026 10:00",
        titulo: "Aprovado na análise",
        autor: "Administrador — Carlos Melo",
      },
      { data: "26/08/2026 09:00", titulo: "Enviado para assinatura", autor: "Sistema" },
      { data: "29/08/2026 12:12", titulo: "Contrato assinado", autor: "Sistema" },
    ],
    pendencia: "Aguardando ativação na data de início",
  },
  {
    id: "ct-2025-0098",
    numero: "CT-2025-0098",
    propertyId: "p3",
    status: "ENCERRADO",
    inicio: "01/01/2023",
    termino: "31/12/2024",
    atualizadoEm: "02/01/2025 09:00",
    garantia: { tipo: "FIANCA", detalhe: "Fiador — Paulo Henrique Dias" },
    condicoes: condicoes("R$ 3.900,00", { prazo: "24 meses" }),
    partes: [
      { clientId: "c3", role: "LOCADOR" },
      { clientId: "c1", role: "LOCATARIO" },
      { clientId: "c5", role: "FIADOR" },
    ],
    documentos: [
      {
        versao: "v1",
        geradoEm: "20/12/2022 10:00",
        status: "Arquivada",
        hash: "cc71f0a3b8e51d92",
        motivo: "Geração inicial",
      },
    ],
    assinaturas: [
      { clientId: "c3", role: "LOCADOR", status: "ASSINADO", assinadoEm: "28/12/2022 10:00" },
      { clientId: "c1", role: "LOCATARIO", status: "ASSINADO", assinadoEm: "28/12/2022 12:00" },
      { clientId: "c5", role: "FIADOR", status: "ASSINADO", assinadoEm: "28/12/2022 15:00" },
    ],
    historico: [
      { data: "18/12/2022 09:00", titulo: "Contrato criado", autor: "Corretor — Ana Duarte" },
      { data: "01/01/2023 00:00", titulo: "Contrato ativado", autor: "Sistema" },
      {
        data: "02/01/2025 09:00",
        titulo: "Contrato encerrado",
        autor: "Administrador — Carlos Melo",
      },
    ],
  },
  {
    id: "ct-2026-0110",
    numero: "CT-2026-0110",
    propertyId: "p2",
    status: "RECUSADO",
    inicio: "01/08/2026",
    termino: "31/07/2028",
    atualizadoEm: "12/08/2026 17:30",
    garantia: { tipo: "SEGURO_FIANCA", detalhe: "Apólice recusada pela seguradora" },
    condicoes: condicoes("R$ 8.400,00", { prazo: "24 meses" }),
    partes: [
      { clientId: "c2", role: "LOCADOR" },
      { clientId: "c4", role: "LOCATARIO" },
    ],
    documentos: [
      {
        versao: "v1",
        geradoEm: "05/08/2026 11:00",
        status: "Arquivada",
        hash: "4f8ab2c6019de375",
        motivo: "Geração inicial",
      },
    ],
    assinaturas: [
      { clientId: "c2", role: "LOCADOR", status: "ASSINADO", assinadoEm: "10/08/2026 09:00" },
      { clientId: "c4", role: "LOCATARIO", status: "RECUSADO", assinadoEm: "12/08/2026 17:30" },
    ],
    historico: [
      { data: "04/08/2026 10:00", titulo: "Contrato criado", autor: "Corretor — Ana Duarte" },
      { data: "05/08/2026 11:00", titulo: "Documento gerado (v1)", autor: "Sistema" },
      {
        data: "12/08/2026 17:30",
        titulo: "Assinatura recusada pelo locatário",
        autor: "Helena Souza Campos",
      },
    ],
  },
];

export type AuditEvent = {
  id: string;
  usuario: string;
  acao: string;
  entidade: string;
  registro: string;
  dataHora: string;
  ip: string;
  userAgent: string;
  antes: string;
  depois: string;
};

export const auditEvents: AuditEvent[] = [
  {
    id: "a1",
    usuario: "Ana Duarte (corretor)",
    acao: "UPDATE",
    entidade: "Contrato",
    registro: "CT-2026-0142",
    dataHora: "30/08/2026 14:02",
    ip: "189.45.201.17",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/128.0",
    antes: '{ "indice": "IPCA", "versaoDocumento": "v2" }',
    depois: '{ "indice": "IGP-M", "versaoDocumento": "v3" }',
  },
  {
    id: "a2",
    usuario: "Sistema",
    acao: "CREATE",
    entidade: "DocumentoVersao",
    registro: "CT-2026-0142 / v3",
    dataHora: "30/08/2026 14:02",
    ip: "10.0.0.8",
    userAgent: "contract-worker/1.4.2",
    antes: "null",
    depois: '{ "versao": "v3", "hash": "9f2c4ab1d77e0b53" }',
  },
  {
    id: "a3",
    usuario: "Rogério Campos Lima (cliente)",
    acao: "SIGN",
    entidade: "Assinatura",
    registro: "CT-2026-0142 / FIADOR",
    dataHora: "31/08/2026 09:12",
    ip: "201.17.88.240",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_2) Safari/605.1",
    antes: '{ "status": "PENDENTE" }',
    depois: '{ "status": "ASSINADO", "assinadoEm": "31/08/2026 09:12" }',
  },
  {
    id: "a4",
    usuario: "Carlos Melo (administrador)",
    acao: "STATUS_CHANGE",
    entidade: "Contrato",
    registro: "CT-2026-0140",
    dataHora: "30/08/2026 15:50",
    ip: "189.45.201.20",
    userAgent: "Mozilla/5.0 (Windows NT 10.0) Firefox/131.0",
    antes: '{ "status": "EM_ANALISE" }',
    depois: '{ "status": "PRONTO_PARA_ASSINATURA" }',
  },
  {
    id: "a5",
    usuario: "Ana Duarte (corretor)",
    acao: "CREATE",
    entidade: "Imovel",
    registro: "IM-0004",
    dataHora: "01/09/2026 19:30",
    ip: "189.45.201.17",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/128.0",
    antes: "null",
    depois: '{ "codigo": "IM-0004", "cep": "09015-000" }',
  },
  {
    id: "a6",
    usuario: "Helena Souza Campos (cliente)",
    acao: "REJECT",
    entidade: "Assinatura",
    registro: "CT-2026-0110 / LOCATARIO",
    dataHora: "12/08/2026 17:30",
    ip: "177.92.14.6",
    userAgent: "Mozilla/5.0 (Linux; Android 14) Chrome/127.0",
    antes: '{ "status": "PENDENTE" }',
    depois: '{ "status": "RECUSADO", "motivo": "Divergência no valor do aluguel" }',
  },
];

export function getClient(id: string) {
  return clients.find((c) => c.id === id);
}

export function getProperty(id: string) {
  return properties.find((p) => p.id === id);
}

export function getContract(id: string) {
  return contracts.find((c) => c.id === id);
}

export function propertyLabel(id: string) {
  const p = getProperty(id);
  return p ? `${p.codigo} — ${p.logradouro}, ${p.numero}` : "—";
}

export function tenantName(contract: Contract) {
  const party = contract.partes.find((p) => p.role === "LOCATARIO");
  return party ? (getClient(party.clientId)?.nome ?? "—") : "—";
}

/** Contratos visíveis para o cliente logado no portal (Marina Alves Ribeiro). */
export const PORTAL_CLIENT_ID = "c1";
