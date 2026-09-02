import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import {
  Button,
  Callout,
  Field,
  FieldGrid,
  Input,
  PageHeader,
  Panel,
  RadioCards,
  Select,
  Stepper,
  Textarea,
} from "@/components/wire";
import { formatCep, lookupCep, normalizeCep } from "@/data/cep";
import {
  GUARANTEE_LABEL,
  ROLE_LABEL,
  type GuaranteeType,
  type Party,
  type PartyRole,
} from "@/data/mock";
import {
  createClient,
  createProperty,
  getClient,
  getProperty,
  propertyLabel,
  saveDraft,
  submitForAnalysis,
  useAppStore,
  type ContractDraft,
} from "@/data/store";

export const Route = createFileRoute("/contratos/novo")({
  head: () => ({
    meta: [
      { title: "Novo contrato | Gestão de Contratos de Locação" },
      {
        name: "description",
        content:
          "Fluxo em etapas para criar um contrato de locação: imóvel, partes, garantia, condições e revisão.",
      },
      { property: "og:title", content: "Novo contrato | Gestão de Contratos" },
      { property: "og:description", content: "Crie um contrato de locação em etapas." },
    ],
  }),
  component: NewContractPage,
});

const STEPS = ["Imóvel", "Partes", "Garantia", "Condições", "Revisão"];

const defaultCondicoes = {
  aluguel: "",
  vencimento: "Dia 10",
  indice: "IGP-M",
  periodicidade: "Anual",
  condominio: "",
  iptu: "",
  multaMoratoria: "2%",
  jurosMora: "1% ao mês",
  multaRescisoria: "3 aluguéis",
  prazo: "30 meses",
};

type NewPropertyForm = {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  tipo: string;
  area: string;
};

function emptyProperty(): NewPropertyForm {
  return {
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: "",
    tipo: "Apartamento",
    area: "",
  };
}

function NewContractPage() {
  const navigate = useNavigate();
  const store = useAppStore();
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<"existente" | "novo">("existente");
  const [propertyId, setPropertyId] = useState(store.properties[0]?.id ?? "");
  const [newProp, setNewProp] = useState<NewPropertyForm>(emptyProperty());
  const [cepMsg, setCepMsg] = useState<string | null>(null);
  const [partes, setPartes] = useState<Party[]>([
    { clientId: store.clients[1]?.id ?? "", role: "LOCADOR" },
    { clientId: store.clients[0]?.id ?? "", role: "LOCATARIO" },
  ]);
  const [garantiaTipo, setGarantiaTipo] = useState<GuaranteeType>("SEM_GARANTIA");
  const [garantiaDetalhe, setGarantiaDetalhe] = useState("");
  const [condicoes, setCondicoes] = useState(defaultCondicoes);
  const [inicio, setInicio] = useState("01/10/2026");
  const [termino, setTermino] = useState("30/09/2029");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const resolvedPropertyId = propertyId;

  function setCond<K extends keyof typeof defaultCondicoes>(key: K, value: string) {
    setCondicoes((c) => ({ ...c, [key]: value }));
  }

  function partiesOf(role: PartyRole) {
    return partes.filter((p) => p.role === role);
  }

  function setRole(role: PartyRole, clientId: string, index = 0) {
    setPartes((prev) => {
      const others = prev.filter((p) => p.role !== role);
      const current = prev.filter((p) => p.role === role);
      if (!clientId) {
        return [...others, ...current.filter((_, i) => i !== index)];
      }
      const next = [...current];
      if (next[index]) next[index] = { role, clientId };
      else next.push({ role, clientId });
      return [...others, ...next];
    });
  }

  function addWitness() {
    const unused = store.clients.find((c) => !partes.some((p) => p.clientId === c.id));
    setPartes((prev) => [
      ...prev,
      { role: "TESTEMUNHA", clientId: unused?.id ?? store.clients[0].id },
    ]);
  }

  function lookupAddress() {
    const found = lookupCep(newProp.cep);
    if (!found) {
      setCepMsg("CEP não encontrado na base mockada. Preencha o endereço manualmente.");
      return;
    }
    setCepMsg("Endereço localizado (dados mockados). Confirme e complemente.");
    setNewProp((p) => ({
      ...p,
      cep: formatCep(p.cep),
      logradouro: found.logradouro,
      bairro: found.bairro,
      cidade: found.cidade,
      uf: found.uf,
    }));
  }

  function ensureProperty(): string | null {
    if (mode === "existente") {
      return propertyId || null;
    }
    if (!normalizeCep(newProp.cep) || !newProp.logradouro || !newProp.numero) {
      return null;
    }
    const created = createProperty({
      cep: formatCep(newProp.cep),
      logradouro: newProp.logradouro,
      numero: newProp.numero,
      complemento: newProp.complemento || undefined,
      bairro: newProp.bairro,
      cidade: newProp.cidade,
      uf: newProp.uf,
      tipo: newProp.tipo,
      area: newProp.area || "—",
    });
    setPropertyId(created.id);
    setMode("existente");
    return created.id;
  }

  function buildDraft(pid: string): ContractDraft {
    return {
      propertyId: pid,
      partes: partes.filter((p) => p.clientId),
      garantia: { tipo: garantiaTipo, detalhe: garantiaDetalhe || GUARANTEE_LABEL[garantiaTipo] },
      condicoes,
      inicio,
      termino,
    };
  }

  function validate(forSubmit: boolean) {
    if (!propertyId && mode === "existente") return "Selecione um imóvel.";
    if (mode === "novo" && !newProp.logradouro) return "Informe o endereço do imóvel.";
    if (!partes.some((p) => p.role === "LOCADOR" && p.clientId)) return "Informe o locador.";
    if (!partes.some((p) => p.role === "LOCATARIO" && p.clientId)) return "Informe o locatário.";
    if (garantiaTipo === "FIANCA" && !partes.some((p) => p.role === "FIADOR")) {
      return "A modalidade fiança exige um fiador.";
    }
    if (forSubmit && !condicoes.aluguel) return "Informe o valor do aluguel.";
    return null;
  }

  function persist(kind: "draft" | "submit") {
    setError(null);
    const msg = validate(kind === "submit");
    if (msg) {
      setError(msg);
      return;
    }
    const pid = ensureProperty();
    if (!pid) {
      setError("Confirme o imóvel antes de continuar.");
      return;
    }
    const draft = buildDraft(pid);
    if (kind === "draft") {
      const c = saveDraft(draft);
      setSuccess(`Rascunho ${c.numero} salvo.`);
      navigate({ to: "/contratos/$id", params: { id: c.id } });
    } else {
      const c = submitForAnalysis(draft);
      setSuccess(`Contrato ${c.numero} submetido para análise.`);
      navigate({ to: "/contratos/$id/analise", params: { id: c.id } });
    }
  }

  const previewProperty = mode === "existente" ? getProperty(resolvedPropertyId) : null;

  return (
    <AdminLayout>
      <PageHeader
        title="Novo contrato"
        description="Fluxo em etapas. Revise antes de submeter para análise."
        actions={
          <Link to="/contratos">
            <Button>Voltar à lista</Button>
          </Link>
        }
      />
      <Stepper steps={STEPS} current={step} onSelect={setStep} />
      {error ? <Callout tone="error">{error}</Callout> : null}
      {success ? <Callout tone="success">{success}</Callout> : null}

      {step === 0 ? (
        <Panel title="Imóvel">
          <div className="mb-4 flex gap-2">
            <Button
              variant={mode === "existente" ? "primary" : "secondary"}
              onClick={() => setMode("existente")}
            >
              Selecionar existente
            </Button>
            <Button
              variant={mode === "novo" ? "primary" : "secondary"}
              onClick={() => setMode("novo")}
            >
              Criar novo imóvel
            </Button>
          </div>
          {mode === "existente" ? (
            <div className="space-y-4">
              <Select
                label="Imóvel"
                value={propertyId}
                onChange={setPropertyId}
                options={store.properties.map((p) => ({
                  value: p.id,
                  label: `${p.codigo} — ${p.logradouro}, ${p.numero}`,
                }))}
              />
              {previewProperty ? (
                <FieldGrid>
                  <Field label="CEP" value={previewProperty.cep} />
                  <Field
                    label="Endereço"
                    value={`${previewProperty.logradouro}, ${previewProperty.numero}`}
                  />
                  <Field label="Bairro" value={previewProperty.bairro} />
                  <Field
                    label="Cidade / UF"
                    value={`${previewProperty.cidade}/${previewProperty.uf}`}
                  />
                  <Field label="Tipo" value={previewProperty.tipo} />
                  <Field label="Área" value={previewProperty.area} />
                </FieldGrid>
              ) : null}
              <Callout>Imóvel selecionado. Avance para informar as partes.</Callout>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid gap-3 md:grid-cols-3">
                <Input
                  label="CEP"
                  placeholder="00000-000"
                  value={newProp.cep}
                  onChange={(v) => setNewProp((p) => ({ ...p, cep: v }))}
                  hint="Base mockada. Ex.: 01310-100"
                />
                <div className="flex items-end">
                  <Button onClick={lookupAddress}>Buscar CEP</Button>
                </div>
              </div>
              {cepMsg ? <Callout>{cepMsg}</Callout> : null}
              <div className="grid gap-3 md:grid-cols-2">
                <Input
                  label="Logradouro"
                  value={newProp.logradouro}
                  onChange={(v) => setNewProp((p) => ({ ...p, logradouro: v }))}
                />
                <Input
                  label="Número"
                  value={newProp.numero}
                  onChange={(v) => setNewProp((p) => ({ ...p, numero: v }))}
                />
                <Input
                  label="Complemento"
                  value={newProp.complemento}
                  onChange={(v) => setNewProp((p) => ({ ...p, complemento: v }))}
                />
                <Input
                  label="Bairro"
                  value={newProp.bairro}
                  onChange={(v) => setNewProp((p) => ({ ...p, bairro: v }))}
                />
                <Input
                  label="Cidade"
                  value={newProp.cidade}
                  onChange={(v) => setNewProp((p) => ({ ...p, cidade: v }))}
                />
                <Input
                  label="UF"
                  value={newProp.uf}
                  onChange={(v) => setNewProp((p) => ({ ...p, uf: v }))}
                />
                <Select
                  label="Tipo"
                  value={newProp.tipo}
                  onChange={(v) => setNewProp((p) => ({ ...p, tipo: v }))}
                  options={["Apartamento", "Casa", "Sala comercial", "Loja", "Terreno"].map(
                    (t) => ({
                      value: t,
                      label: t,
                    }),
                  )}
                />
                <Input
                  label="Área"
                  placeholder="78 m²"
                  value={newProp.area}
                  onChange={(v) => setNewProp((p) => ({ ...p, area: v }))}
                />
              </div>
            </div>
          )}
        </Panel>
      ) : null}

      {step === 1 ? (
        <Panel title="Partes do contrato">
          <p className="mb-4 text-sm text-muted-foreground">
            Organize os participantes por papel. É possível cadastrar um cliente novo sem sair do
            fluxo.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            <PartyCard
              title={ROLE_LABEL.LOCADOR}
              role="LOCADOR"
              partes={partiesOf("LOCADOR")}
              clients={store.clients}
              onChange={(id) => setRole("LOCADOR", id)}
            />
            <PartyCard
              title={ROLE_LABEL.LOCATARIO}
              role="LOCATARIO"
              partes={partiesOf("LOCATARIO")}
              clients={store.clients}
              onChange={(id) => setRole("LOCATARIO", id)}
            />
            <PartyCard
              title={ROLE_LABEL.FIADOR}
              role="FIADOR"
              partes={partiesOf("FIADOR")}
              clients={store.clients}
              optional
              onChange={(id) => setRole("FIADOR", id)}
            />
            <PartyCard
              title={ROLE_LABEL.CONJUGE_FIADOR}
              role="CONJUGE_FIADOR"
              partes={partiesOf("CONJUGE_FIADOR")}
              clients={store.clients}
              optional
              onChange={(id) => setRole("CONJUGE_FIADOR", id)}
            />
            <PartyCard
              title={ROLE_LABEL.REPRESENTANTE_LEGAL}
              role="REPRESENTANTE_LEGAL"
              partes={partiesOf("REPRESENTANTE_LEGAL")}
              clients={store.clients}
              optional
              onChange={(id) => setRole("REPRESENTANTE_LEGAL", id)}
            />
            <div className="border border-border p-3">
              <p className="text-sm font-medium">Testemunhas</p>
              {partiesOf("TESTEMUNHA").map((p, i) => (
                <div key={`${p.clientId}-${i}`} className="mt-2">
                  <Select
                    label={`Testemunha ${i + 1}`}
                    value={p.clientId}
                    onChange={(id) => setRole("TESTEMUNHA", id, i)}
                    options={store.clients.map((c) => ({ value: c.id, label: c.nome }))}
                  />
                </div>
              ))}
              <div className="mt-3">
                <Button onClick={addWitness}>Adicionar testemunha</Button>
              </div>
            </div>
          </div>
          <QuickClient />
        </Panel>
      ) : null}

      {step === 2 ? (
        <Panel title="Garantia">
          <RadioCards
            label="Modalidade (uma opção)"
            value={garantiaTipo}
            onChange={(v) => {
              setGarantiaTipo(v);
              setGarantiaDetalhe("");
            }}
            options={(Object.keys(GUARANTEE_LABEL) as GuaranteeType[]).map((k) => ({
              value: k,
              label: GUARANTEE_LABEL[k],
            }))}
          />
          <div className="mt-4 space-y-3">
            {garantiaTipo === "CAUCAO_DINHEIRO" ? (
              <Input
                label="Valor da caução"
                placeholder="R$ 12.000,00"
                value={garantiaDetalhe}
                onChange={setGarantiaDetalhe}
              />
            ) : null}
            {garantiaTipo === "CAUCAO_BEM" ? (
              <Textarea
                label="Descrição do bem"
                placeholder="Veículo, imóvel etc."
                value={garantiaDetalhe}
                onChange={setGarantiaDetalhe}
              />
            ) : null}
            {garantiaTipo === "FIANCA" ? (
              <div className="space-y-3">
                <Callout>A fiança usa o fiador informado na etapa Partes.</Callout>
                <Select
                  label="Fiador"
                  value={partiesOf("FIADOR")[0]?.clientId ?? ""}
                  onChange={(id) => setRole("FIADOR", id)}
                  options={[
                    { value: "", label: "Selecionar" },
                    ...store.clients.map((c) => ({ value: c.id, label: c.nome })),
                  ]}
                />
                <Textarea
                  label="Observações da fiança"
                  value={garantiaDetalhe}
                  onChange={setGarantiaDetalhe}
                />
              </div>
            ) : null}
            {garantiaTipo === "SEGURO_FIANCA" ? (
              <Input
                label="Apólice / seguradora"
                placeholder="Porto Seguro nº 0000"
                value={garantiaDetalhe}
                onChange={setGarantiaDetalhe}
              />
            ) : null}
            {garantiaTipo === "CESSAO_FIDUCIARIA" ? (
              <Textarea
                label="Aplicação ou ativo cedido"
                value={garantiaDetalhe}
                onChange={setGarantiaDetalhe}
              />
            ) : null}
            {garantiaTipo === "SEM_GARANTIA" ? (
              <Callout>Nenhum campo adicional. O contrato seguirá sem garantia.</Callout>
            ) : null}
          </div>
        </Panel>
      ) : null}

      {step === 3 ? (
        <div className="space-y-4">
          <Panel title="Valores e vencimento">
            <div className="grid gap-3 md:grid-cols-3">
              <Input
                label="Valor do aluguel"
                value={condicoes.aluguel}
                onChange={(v) => setCond("aluguel", v)}
              />
              <Input
                label="Dia do vencimento"
                value={condicoes.vencimento}
                onChange={(v) => setCond("vencimento", v)}
              />
              <Input
                label="Prazo contratual"
                value={condicoes.prazo}
                onChange={(v) => setCond("prazo", v)}
              />
              <Input label="Início" value={inicio} onChange={setInicio} />
              <Input label="Término" value={termino} onChange={setTermino} />
            </div>
          </Panel>
          <Panel title="Reajuste">
            <div className="grid gap-3 md:grid-cols-2">
              <Select
                label="Índice de reajuste"
                value={condicoes.indice}
                onChange={(v) => setCond("indice", v)}
                options={["IGP-M", "IPCA", "INPC"].map((v) => ({ value: v, label: v }))}
              />
              <Select
                label="Periodicidade"
                value={condicoes.periodicidade}
                onChange={(v) => setCond("periodicidade", v)}
                options={["Anual", "Bienal", "Não se aplica"].map((v) => ({ value: v, label: v }))}
              />
            </div>
          </Panel>
          <Panel title="Encargos e penalidades">
            <div className="grid gap-3 md:grid-cols-2">
              <Input
                label="Condomínio"
                value={condicoes.condominio}
                onChange={(v) => setCond("condominio", v)}
              />
              <Input label="IPTU" value={condicoes.iptu} onChange={(v) => setCond("iptu", v)} />
              <Input
                label="Multa moratória"
                value={condicoes.multaMoratoria}
                onChange={(v) => setCond("multaMoratoria", v)}
              />
              <Input
                label="Juros"
                value={condicoes.jurosMora}
                onChange={(v) => setCond("jurosMora", v)}
              />
              <Input
                label="Multa rescisória"
                value={condicoes.multaRescisoria}
                onChange={(v) => setCond("multaRescisoria", v)}
              />
            </div>
          </Panel>
        </div>
      ) : null}

      {step === 4 ? (
        <Review
          propertyId={mode === "existente" ? propertyId : ""}
          newProp={mode === "novo" ? newProp : null}
          partes={partes}
          garantiaTipo={garantiaTipo}
          garantiaDetalhe={garantiaDetalhe}
          condicoes={condicoes}
          inicio={inicio}
          termino={termino}
          onEdit={setStep}
        />
      ) : null}

      <div className="flex flex-wrap justify-between gap-2">
        <Button disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>
          Voltar
        </Button>
        <div className="flex flex-wrap gap-2">
          {step === 4 ? (
            <>
              <Button onClick={() => persist("draft")}>Salvar rascunho</Button>
              <Button variant="primary" onClick={() => persist("submit")}>
                Submeter para análise
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              onClick={() => {
                setError(null);
                if (step === 0 && mode === "novo") {
                  const pid = ensureProperty();
                  if (!pid) {
                    setError("Informe CEP, logradouro e número para confirmar o imóvel.");
                    return;
                  }
                }
                setStep((s) => Math.min(STEPS.length - 1, s + 1));
              }}
            >
              Continuar
            </Button>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

function PartyCard({
  title,
  partes,
  clients,
  onChange,
  optional,
}: {
  title: string;
  role: PartyRole;
  partes: Party[];
  clients: { id: string; nome: string }[];
  onChange: (id: string) => void;
  optional?: boolean;
}) {
  return (
    <div className="border border-border p-3">
      <p className="text-sm font-medium">
        {title}{" "}
        {optional ? (
          <span className="text-xs font-normal text-muted-foreground">(opcional)</span>
        ) : null}
      </p>
      <div className="mt-2">
        <Select
          label="Cliente"
          value={partes[0]?.clientId ?? ""}
          onChange={onChange}
          options={[
            { value: "", label: optional ? "Não informar" : "Selecionar" },
            ...clients.map((c) => ({ value: c.id, label: c.nome })),
          ]}
        />
      </div>
      {partes[0]?.clientId ? (
        <p className="mt-2 text-xs text-muted-foreground">
          {getClient(partes[0].clientId)?.documento}
        </p>
      ) : null}
    </div>
  );
}

function QuickClient() {
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [documento, setDocumento] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [tipo, setTipo] = useState<"PF" | "PJ">("PF");
  const [done, setDone] = useState<string | null>(null);

  return (
    <div className="mt-4 border border-dashed border-border p-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Cadastrar cliente rápido</p>
        <Button onClick={() => setOpen((v) => !v)}>{open ? "Fechar" : "Novo cliente"}</Button>
      </div>
      {done ? <Callout tone="success">{done}</Callout> : null}
      {open ? (
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <Input label="Nome" value={nome} onChange={setNome} />
          <Select
            label="Tipo"
            value={tipo}
            onChange={(v) => setTipo(v as "PF" | "PJ")}
            options={[
              { value: "PF", label: "Pessoa física" },
              { value: "PJ", label: "Pessoa jurídica" },
            ]}
          />
          <Input label="Documento" value={documento} onChange={setDocumento} />
          <Input label="E-mail" value={email} onChange={setEmail} />
          <Input label="Telefone" value={telefone} onChange={setTelefone} />
          <div className="flex items-end">
            <Button
              variant="primary"
              onClick={() => {
                if (!nome) return;
                const c = createClient({ nome, documento, email, telefone, tipo });
                setDone(`${c.nome} cadastrado e disponível nas listas.`);
                setOpen(false);
                setNome("");
              }}
            >
              Salvar cliente
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Review({
  propertyId,
  newProp,
  partes,
  garantiaTipo,
  garantiaDetalhe,
  condicoes,
  inicio,
  termino,
  onEdit,
}: {
  propertyId: string;
  newProp: NewPropertyForm | null;
  partes: Party[];
  garantiaTipo: GuaranteeType;
  garantiaDetalhe: string;
  condicoes: typeof defaultCondicoes;
  inicio: string;
  termino: string;
  onEdit: (step: number) => void;
}) {
  const property = propertyId ? getProperty(propertyId) : null;
  return (
    <div className="space-y-4">
      <Panel
        title="Imóvel"
        aside={
          <button type="button" className="text-sm underline" onClick={() => onEdit(0)}>
            Editar
          </button>
        }
      >
        {property ? (
          <p className="text-sm">{propertyLabel(property.id)}</p>
        ) : newProp ? (
          <p className="text-sm">
            {newProp.logradouro}, {newProp.numero} — {newProp.cidade}/{newProp.uf}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhum imóvel confirmado.</p>
        )}
      </Panel>
      <Panel
        title="Partes"
        aside={
          <button type="button" className="text-sm underline" onClick={() => onEdit(1)}>
            Editar
          </button>
        }
      >
        <ul className="space-y-1 text-sm">
          {partes
            .filter((p) => p.clientId)
            .map((p, i) => (
              <li key={`${p.role}-${p.clientId}-${i}`}>
                <span className="text-muted-foreground">{ROLE_LABEL[p.role]}:</span>{" "}
                {getClient(p.clientId)?.nome}
              </li>
            ))}
        </ul>
        <p className="mt-2 text-xs text-muted-foreground">
          Locador e locatário devem estar preenchidos antes de submeter.
        </p>
      </Panel>
      <Panel
        title="Garantia"
        aside={
          <button type="button" className="text-sm underline" onClick={() => onEdit(2)}>
            Editar
          </button>
        }
      >
        <p className="text-sm">{GUARANTEE_LABEL[garantiaTipo]}</p>
        {garantiaDetalhe ? (
          <p className="text-sm text-muted-foreground">{garantiaDetalhe}</p>
        ) : null}
      </Panel>
      <Panel
        title="Condições comerciais"
        aside={
          <button type="button" className="text-sm underline" onClick={() => onEdit(3)}>
            Editar
          </button>
        }
      >
        <FieldGrid>
          <Field label="Aluguel" value={condicoes.aluguel || "—"} />
          <Field label="Vencimento" value={condicoes.vencimento} />
          <Field label="Índice" value={condicoes.indice} />
          <Field label="Periodicidade" value={condicoes.periodicidade} />
          <Field label="Condomínio" value={condicoes.condominio || "—"} />
          <Field label="IPTU" value={condicoes.iptu || "—"} />
          <Field label="Multa moratória" value={condicoes.multaMoratoria} />
          <Field label="Juros" value={condicoes.jurosMora} />
          <Field label="Multa rescisória" value={condicoes.multaRescisoria} />
          <Field label="Prazo" value={condicoes.prazo} />
          <Field label="Início" value={inicio} />
          <Field label="Término" value={termino} />
        </FieldGrid>
      </Panel>
    </div>
  );
}
