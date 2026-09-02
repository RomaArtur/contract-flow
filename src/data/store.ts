import { useSyncExternalStore } from "react";
import {
  auditEvents as seedAudit,
  clients as seedClients,
  contracts as seedContracts,
  properties as seedProperties,
  type AuditEvent,
  type Client,
  type Contract,
  type ContractStatus,
  type GuaranteeType,
  type HistoryEvent,
  type Party,
  type Property,
  type Signature,
} from "./mock";

export type CheckStatus = "VALIDADO" | "PENDENTE" | "REPROVADO";

export type AnalysisItem = {
  id: string;
  label: string;
  status: CheckStatus;
};

export type AppState = {
  clients: Client[];
  properties: Property[];
  contracts: Contract[];
  auditEvents: AuditEvent[];
  analysis: Record<string, AnalysisItem[]>;
};

function clone<T>(value: T): T {
  return structuredClone(value);
}

function nowLabel() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function defaultAnalysis(contract: Contract): AnalysisItem[] {
  const hasSpouse = contract.partes.some((p) => p.role === "CONJUGE_FIADOR");
  const items: AnalysisItem[] = [
    { id: "imovel", label: "Identificação do imóvel", status: "PENDENTE" },
    { id: "locador", label: "Locador", status: "PENDENTE" },
    { id: "locatario", label: "Locatário", status: "PENDENTE" },
    { id: "garantia", label: "Garantia", status: "PENDENTE" },
    { id: "condicoes", label: "Condições comerciais", status: "PENDENTE" },
    { id: "cadastro", label: "Dados cadastrais", status: "PENDENTE" },
  ];
  if (hasSpouse) {
    items.push({ id: "outorga", label: "Outorga conjugal", status: "PENDENTE" });
  }
  return items;
}

const initialAnalysis: Record<string, AnalysisItem[]> = {};
for (const c of seedContracts) {
  if (c.status === "EM_ANALISE") {
    initialAnalysis[c.id] = defaultAnalysis(c).map((item, i) => ({
      ...item,
      status: i < 3 ? "VALIDADO" : "PENDENTE",
    }));
  }
}

let state: AppState = {
  clients: clone(seedClients),
  properties: clone(seedProperties),
  contracts: clone(seedContracts),
  auditEvents: clone(seedAudit),
  analysis: initialAnalysis,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

export function useAppStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function getClient(id: string) {
  return state.clients.find((c) => c.id === id);
}

export function getProperty(id: string) {
  return state.properties.find((p) => p.id === id);
}

export function getContract(id: string) {
  return state.contracts.find((c) => c.id === id);
}

export function getAuditEvent(id: string) {
  return state.auditEvents.find((e) => e.id === id);
}

export function propertyLabel(id: string) {
  const p = getProperty(id);
  return p ? `${p.codigo} — ${p.logradouro}, ${p.numero}` : "—";
}

export function tenantName(contract: Contract) {
  const party = contract.partes.find((p) => p.role === "LOCATARIO");
  return party ? (getClient(party.clientId)?.nome ?? "—") : "—";
}

export function landlordName(contract: Contract) {
  const party = contract.partes.find((p) => p.role === "LOCADOR");
  return party ? (getClient(party.clientId)?.nome ?? "—") : "—";
}

function pushAudit(
  partial: Omit<AuditEvent, "id" | "dataHora" | "ip" | "userAgent"> &
    Partial<Pick<AuditEvent, "ip" | "userAgent">>,
) {
  const event: AuditEvent = {
    id: `a${Date.now()}`,
    dataHora: nowLabel(),
    ip: partial.ip ?? "189.45.201.17",
    userAgent: partial.userAgent ?? "Mozilla/5.0 (prototype) Chrome/128.0",
    ...partial,
  };
  state = { ...state, auditEvents: [event, ...state.auditEvents] };
}

function patchContract(id: string, updater: (c: Contract) => Contract) {
  state = {
    ...state,
    contracts: state.contracts.map((c) => (c.id === id ? updater(c) : c)),
  };
}

function addHistory(
  contract: Contract,
  titulo: string,
  autor: string,
  detalhe?: string,
): HistoryEvent[] {
  return [...contract.historico, { data: nowLabel(), titulo, autor, detalhe }];
}

export type NewClientInput = Omit<Client, "id">;
export type NewPropertyInput = Omit<Property, "id" | "codigo"> & { codigo?: string };

export function createClient(input: NewClientInput) {
  const client: Client = { ...input, id: `c${Date.now()}` };
  state = { ...state, clients: [...state.clients, client] };
  pushAudit({
    usuario: "Ana Duarte (corretor)",
    acao: "CREATE",
    entidade: "Cliente",
    registro: client.nome,
    antes: "null",
    depois: JSON.stringify({ nome: client.nome, documento: client.documento }),
  });
  emit();
  return client;
}

export function updateClient(id: string, input: NewClientInput) {
  const before = getClient(id);
  state = {
    ...state,
    clients: state.clients.map((c) => (c.id === id ? { ...c, ...input } : c)),
  };
  pushAudit({
    usuario: "Ana Duarte (corretor)",
    acao: "UPDATE",
    entidade: "Cliente",
    registro: input.nome,
    antes: JSON.stringify(before ?? {}),
    depois: JSON.stringify(input),
  });
  emit();
}

export function createProperty(input: NewPropertyInput) {
  const n = state.properties.length + 1;
  const property: Property = {
    ...input,
    id: `p${Date.now()}`,
    codigo: input.codigo ?? `IM-${String(n).padStart(4, "0")}`,
  };
  state = { ...state, properties: [...state.properties, property] };
  pushAudit({
    usuario: "Ana Duarte (corretor)",
    acao: "CREATE",
    entidade: "Imovel",
    registro: property.codigo,
    antes: "null",
    depois: JSON.stringify({ codigo: property.codigo, cep: property.cep }),
  });
  emit();
  return property;
}

export function updateProperty(id: string, input: NewPropertyInput) {
  const before = getProperty(id);
  state = {
    ...state,
    properties: state.properties.map((p) =>
      p.id === id ? { ...p, ...input, id: p.id, codigo: input.codigo ?? p.codigo } : p,
    ),
  };
  pushAudit({
    usuario: "Ana Duarte (corretor)",
    acao: "UPDATE",
    entidade: "Imovel",
    registro: before?.codigo ?? id,
    antes: JSON.stringify(before ?? {}),
    depois: JSON.stringify(input),
  });
  emit();
}

export type ContractDraft = {
  propertyId: string;
  partes: Party[];
  garantia: { tipo: GuaranteeType; detalhe: string };
  condicoes: Contract["condicoes"];
  inicio: string;
  termino: string;
};

function nextNumero() {
  const year = new Date().getFullYear();
  const seq = state.contracts.length + 150;
  return `CT-${year}-${String(seq).padStart(4, "0")}`;
}

function buildContract(
  draft: ContractDraft,
  status: Extract<ContractStatus, "RASCUNHO" | "EM_ANALISE">,
): Contract {
  const id = `ct-${Date.now()}`;
  const numero = nextNumero();
  const historico: HistoryEvent[] = [
    { data: nowLabel(), titulo: "Contrato criado", autor: "Corretor — Ana Duarte" },
  ];
  if (status === "EM_ANALISE") {
    historico.push({
      data: nowLabel(),
      titulo: "Submetido para análise",
      autor: "Corretor — Ana Duarte",
    });
  }
  const contract: Contract = {
    id,
    numero,
    propertyId: draft.propertyId,
    status,
    inicio: draft.inicio,
    termino: draft.termino,
    atualizadoEm: nowLabel(),
    garantia: draft.garantia,
    condicoes: draft.condicoes,
    partes: draft.partes,
    documentos: [],
    assinaturas: [],
    historico,
    pendencia:
      status === "RASCUNHO"
        ? "Rascunho salvo — completar e submeter para análise"
        : "Aguardando análise",
  };
  return contract;
}

export function saveDraft(draft: ContractDraft) {
  const contract = buildContract(draft, "RASCUNHO");
  state = { ...state, contracts: [contract, ...state.contracts] };
  pushAudit({
    usuario: "Ana Duarte (corretor)",
    acao: "CREATE",
    entidade: "Contrato",
    registro: contract.numero,
    antes: "null",
    depois: JSON.stringify({ status: "RASCUNHO", numero: contract.numero }),
  });
  emit();
  return contract;
}

export function submitForAnalysis(draft: ContractDraft) {
  const contract = buildContract(draft, "EM_ANALISE");
  state = {
    ...state,
    contracts: [contract, ...state.contracts],
    analysis: { ...state.analysis, [contract.id]: defaultAnalysis(contract) },
  };
  pushAudit({
    usuario: "Ana Duarte (corretor)",
    acao: "STATUS_CHANGE",
    entidade: "Contrato",
    registro: contract.numero,
    antes: '{ "status": "RASCUNHO" }',
    depois: '{ "status": "EM_ANALISE" }',
  });
  emit();
  return contract;
}

export function submitExistingForAnalysis(id: string) {
  const before = getContract(id);
  patchContract(id, (c) => ({
    ...c,
    status: "EM_ANALISE",
    atualizadoEm: nowLabel(),
    pendencia: "Aguardando análise",
    historico: addHistory(c, "Submetido para análise", "Corretor — Ana Duarte"),
  }));
  const contract = getContract(id)!;
  state = { ...state, analysis: { ...state.analysis, [id]: defaultAnalysis(contract) } };
  pushAudit({
    usuario: "Ana Duarte (corretor)",
    acao: "STATUS_CHANGE",
    entidade: "Contrato",
    registro: contract.numero,
    antes: JSON.stringify({ status: before?.status }),
    depois: '{ "status": "EM_ANALISE" }',
  });
  emit();
}

export function setAnalysisItem(contractId: string, itemId: string, status: CheckStatus) {
  const items = state.analysis[contractId] ?? [];
  state = {
    ...state,
    analysis: {
      ...state.analysis,
      [contractId]: items.map((i) => (i.id === itemId ? { ...i, status } : i)),
    },
  };
  emit();
}

export function getAnalysis(contractId: string) {
  return state.analysis[contractId];
}

export function approveContract(id: string) {
  const before = getContract(id);
  patchContract(id, (c) => ({
    ...c,
    status: "PRONTO_PARA_ASSINATURA",
    atualizadoEm: nowLabel(),
    pendencia: "Pronto para envio de assinaturas",
    historico: [
      ...addHistory(c, "Contrato aprovado", "Administrador — Carlos Melo"),
      {
        data: nowLabel(),
        titulo: "Documento gerado",
        autor: "Sistema",
        detalhe: "Versão inicial após aprovação",
      },
    ],
    documentos: [
      {
        versao: "v1",
        geradoEm: nowLabel(),
        status: "Vigente",
        hash: Math.random().toString(16).slice(2, 18),
        motivo: "Geração após aprovação",
      },
      ...c.documentos.map((d) => ({ ...d, status: "OBSOLETO" })),
    ],
  }));
  const after = getContract(id)!;
  pushAudit({
    usuario: "Carlos Melo (administrador)",
    acao: "STATUS_CHANGE",
    entidade: "Contrato",
    registro: after.numero,
    antes: JSON.stringify({ status: before?.status }),
    depois: JSON.stringify({ status: after.status }),
  });
  emit();
}

export function refuseContract(id: string) {
  const before = getContract(id);
  patchContract(id, (c) => ({
    ...c,
    status: "RECUSADO",
    atualizadoEm: nowLabel(),
    pendencia: "Contrato recusado na análise",
    historico: addHistory(c, "Contrato recusado", "Administrador — Carlos Melo"),
  }));
  const after = getContract(id)!;
  pushAudit({
    usuario: "Carlos Melo (administrador)",
    acao: "STATUS_CHANGE",
    entidade: "Contrato",
    registro: after.numero,
    antes: JSON.stringify({ status: before?.status }),
    depois: JSON.stringify({ status: after.status }),
  });
  emit();
}

export function sendForSignature(id: string) {
  patchContract(id, (c) => {
    const assinaturas: Signature[] = c.partes
      .filter((p) => p.role !== "REPRESENTANTE_LEGAL")
      .map((p) => ({
        clientId: p.clientId,
        role: p.role,
        status: "PENDENTE" as const,
      }));
    return {
      ...c,
      status: "AGUARDANDO_ASSINATURAS",
      atualizadoEm: nowLabel(),
      pendencia: `${assinaturas.length} assinaturas pendentes`,
      assinaturas,
      historico: addHistory(c, "Enviado para assinatura", "Administrador — Carlos Melo"),
    };
  });
  const after = getContract(id)!;
  pushAudit({
    usuario: "Ana Duarte (corretor)",
    acao: "STATUS_CHANGE",
    entidade: "Contrato",
    registro: after.numero,
    antes: '{ "status": "PRONTO_PARA_ASSINATURA" }',
    depois: '{ "status": "AGUARDANDO_ASSINATURAS" }',
  });
  emit();
}

export function resendSignatureRequest(id: string) {
  patchContract(id, (c) => ({
    ...c,
    atualizadoEm: nowLabel(),
    historico: addHistory(c, "Solicitação de assinatura reenviada", "Corretor — Ana Duarte"),
  }));
  const after = getContract(id)!;
  pushAudit({
    usuario: "Ana Duarte (corretor)",
    acao: "NOTIFY",
    entidade: "Assinatura",
    registro: after.numero,
    antes: "null",
    depois: '{ "acao": "reenvio" }',
  });
  emit();
}

export function activateContract(id: string) {
  patchContract(id, (c) => ({
    ...c,
    status: "ATIVO",
    atualizadoEm: nowLabel(),
    pendencia: undefined,
    historico: addHistory(c, "Contrato ativado", "Sistema"),
  }));
  const after = getContract(id)!;
  pushAudit({
    usuario: "Sistema",
    acao: "STATUS_CHANGE",
    entidade: "Contrato",
    registro: after.numero,
    antes: '{ "status": "ASSINADO" }',
    depois: '{ "status": "ATIVO" }',
  });
  emit();
}

export function cancelContract(id: string) {
  const before = getContract(id);
  patchContract(id, (c) => ({
    ...c,
    status: "CANCELADO",
    atualizadoEm: nowLabel(),
    pendencia: "Contrato cancelado",
    historico: addHistory(c, "Contrato cancelado", "Administrador — Carlos Melo"),
  }));
  const after = getContract(id)!;
  pushAudit({
    usuario: "Carlos Melo (administrador)",
    acao: "STATUS_CHANGE",
    entidade: "Contrato",
    registro: after.numero,
    antes: JSON.stringify({ status: before?.status }),
    depois: '{ "status": "CANCELADO" }',
  });
  emit();
}

export function signAsPortalClient(contractId: string, clientId: string) {
  patchContract(contractId, (c) => {
    const assinaturas = c.assinaturas.map((s) =>
      s.clientId === clientId ? { ...s, status: "ASSINADO" as const, assinadoEm: nowLabel() } : s,
    );
    const pending = assinaturas.filter((s) => s.status === "PENDENTE").length;
    const allSigned = assinaturas.length > 0 && pending === 0;
    return {
      ...c,
      assinaturas,
      status: allSigned ? "ASSINADO" : c.status,
      atualizadoEm: nowLabel(),
      pendencia: allSigned ? "Aguardando ativação" : `${pending} assinatura(s) pendente(s)`,
      historico: [
        ...addHistory(c, "Locatário assinou", getClient(clientId)?.nome ?? "Cliente"),
        ...(allSigned ? [{ data: nowLabel(), titulo: "Contrato assinado", autor: "Sistema" }] : []),
      ],
    };
  });
  const after = getContract(contractId)!;
  pushAudit({
    usuario: `${getClient(clientId)?.nome} (cliente)`,
    acao: "SIGN",
    entidade: "Assinatura",
    registro: `${after.numero} / LOCATARIO`,
    antes: '{ "status": "PENDENTE" }',
    depois: `{ "status": "ASSINADO", "assinadoEm": "${nowLabel()}" }`,
    ip: "201.17.88.240",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_2) Safari/605.1",
  });
  emit();
}

export function portalContractsFor(clientId: string) {
  return state.contracts.filter((c) => c.partes.some((p) => p.clientId === clientId));
}
