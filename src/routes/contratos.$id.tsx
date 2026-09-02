import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { ChildOutlet } from "@/components/ChildOutlet";
import {
  Button,
  Callout,
  ConfirmDialog,
  EmptyState,
  Field,
  FieldGrid,
  PageHeader,
  Panel,
  StatusBadge,
  Table,
  Td,
  Timeline,
  WireTabs,
} from "@/components/wire";
import { GUARANTEE_LABEL, ROLE_LABEL } from "@/data/mock";
import {
  activateContract,
  cancelContract,
  getClient,
  getContract,
  getProperty,
  landlordName,
  propertyLabel,
  resendSignatureRequest,
  sendForSignature,
  submitExistingForAnalysis,
  tenantName,
  useAppStore,
} from "@/data/store";

const TABS = [
  { id: "visao", label: "Visão geral" },
  { id: "partes", label: "Partes" },
  { id: "condicoes", label: "Condições" },
  { id: "documentos", label: "Documentos" },
  { id: "assinaturas", label: "Assinaturas" },
  { id: "historico", label: "Histórico" },
];

export const Route = createFileRoute("/contratos/$id")({
  loader: ({ params }) => {
    const contract = getContract(params.id);
    if (!contract) throw notFound();
    return { numero: contract.numero };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.numero ?? "Contrato"} | Contratos` },
      {
        name: "description",
        content:
          "Detalhes do contrato de locação: partes, garantia, documentos, assinaturas e histórico.",
      },
      { property: "og:title", content: `${loaderData?.numero ?? "Contrato"} | Contratos` },
      { property: "og:description", content: "Detalhes e ciclo de vida do contrato." },
    ],
  }),
  component: ContractDetail,
});

function ContractDetail() {
  const { id } = Route.useParams();
  useAppStore();
  const contract = getContract(id);
  const navigate = useNavigate();
  const [tab, setTab] = useState("visao");
  const [notice, setNotice] = useState<string | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [docView, setDocView] = useState<string | null>(null);

  if (!contract) {
    return (
      <AdminLayout>
        <EmptyState
          title="Contrato não encontrado"
          description="O registro pode ter sido removido."
        />
      </AdminLayout>
    );
  }

  const property = getProperty(contract.propertyId);
  const pending = contract.assinaturas.filter((s) => s.status === "PENDENTE").length;
  const totalSig = contract.assinaturas.length;

  return (
    <ChildOutlet>
      <AdminLayout>
        <PageHeader
          title={contract.numero}
          description={`${propertyLabel(contract.propertyId)} · ${tenantName(contract)}`}
          actions={
            <div className="flex flex-wrap gap-2">
              {contract.status === "RASCUNHO" ? (
                <>
                  <Link to="/contratos/novo">
                    <Button>Continuar edição</Button>
                  </Link>
                  <Button variant="primary" onClick={() => submitExistingForAnalysis(contract.id)}>
                    Submeter para análise
                  </Button>
                </>
              ) : null}
              {contract.status === "EM_ANALISE" ? (
                <Link to="/contratos/$id/analise" params={{ id: contract.id }}>
                  <Button variant="primary">Abrir análise</Button>
                </Link>
              ) : null}
              {contract.status === "PRONTO_PARA_ASSINATURA" ? (
                <Button
                  variant="primary"
                  onClick={() => {
                    sendForSignature(contract.id);
                    setNotice("Contrato enviado para assinatura.");
                    setTab("assinaturas");
                  }}
                >
                  Enviar para assinatura
                </Button>
              ) : null}
              {contract.status === "AGUARDANDO_ASSINATURAS" ? (
                <Button
                  onClick={() => {
                    resendSignatureRequest(contract.id);
                    setNotice("Solicitação de assinatura reenviada (simulação).");
                  }}
                >
                  Reenviar solicitação
                </Button>
              ) : null}
              {contract.status === "ASSINADO" ? (
                <Button
                  variant="primary"
                  onClick={() => {
                    activateContract(contract.id);
                    setNotice("Contrato ativado.");
                  }}
                >
                  Ativar contrato
                </Button>
              ) : null}
              {contract.status !== "CANCELADO" &&
              contract.status !== "ENCERRADO" &&
              contract.status !== "RECUSADO" ? (
                <Button variant="danger" onClick={() => setCancelOpen(true)}>
                  Cancelar
                </Button>
              ) : null}
            </div>
          }
        />

        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={contract.status} />
          {contract.pendencia ? (
            <p className="text-sm text-muted-foreground">{contract.pendencia}</p>
          ) : null}
        </div>

        {notice ? <Callout tone="success">{notice}</Callout> : null}

        <WireTabs tabs={TABS} current={tab} onSelect={setTab} />

        {tab === "visao" ? (
          <div className="space-y-4">
            <Panel title="Informações gerais">
              <FieldGrid>
                <Field label="Número" value={contract.numero} />
                <Field label="Status" value={<StatusBadge status={contract.status} />} />
                <Field label="Início" value={contract.inicio} />
                <Field label="Término" value={contract.termino} />
                <Field label="Última atualização" value={contract.atualizadoEm} />
                <Field label="Locador" value={landlordName(contract)} />
                <Field label="Locatário" value={tenantName(contract)} />
              </FieldGrid>
            </Panel>
            <Panel title="Imóvel">
              {property ? (
                <FieldGrid>
                  <Field label="Código" value={property.codigo} />
                  <Field label="Endereço" value={`${property.logradouro}, ${property.numero}`} />
                  <Field label="CEP" value={property.cep} />
                  <Field label="Bairro" value={property.bairro} />
                  <Field label="Cidade / UF" value={`${property.cidade}/${property.uf}`} />
                  <Field label="Tipo" value={property.tipo} />
                </FieldGrid>
              ) : (
                <EmptyState title="Imóvel não encontrado" />
              )}
            </Panel>
            <Panel title="Resumo da garantia e condições">
              <FieldGrid>
                <Field label="Garantia" value={GUARANTEE_LABEL[contract.garantia.tipo]} />
                <Field label="Detalhe" value={contract.garantia.detalhe} />
                <Field label="Aluguel" value={contract.condicoes.aluguel} />
                <Field label="Prazo" value={contract.condicoes.prazo} />
              </FieldGrid>
            </Panel>
          </div>
        ) : null}

        {tab === "partes" ? (
          <Panel title="Participantes por papel">
            <Table head={["Papel", "Nome", "Documento", "Contato"]}>
              {contract.partes.map((p, i) => {
                const client = getClient(p.clientId);
                return (
                  <tr key={`${p.role}-${p.clientId}-${i}`}>
                    <Td>{ROLE_LABEL[p.role]}</Td>
                    <Td>
                      {client ? (
                        <Link to="/clientes/$id" params={{ id: client.id }} className="underline">
                          {client.nome}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </Td>
                    <Td className="text-muted-foreground">{client?.documento}</Td>
                    <Td className="text-muted-foreground">{client?.email}</Td>
                  </tr>
                );
              })}
            </Table>
          </Panel>
        ) : null}

        {tab === "condicoes" ? (
          <div className="space-y-4">
            <Panel title="Garantia">
              <FieldGrid>
                <Field label="Modalidade" value={GUARANTEE_LABEL[contract.garantia.tipo]} />
                <Field label="Detalhe" value={contract.garantia.detalhe} />
              </FieldGrid>
            </Panel>
            <Panel title="Condições comerciais">
              <FieldGrid>
                <Field label="Aluguel" value={contract.condicoes.aluguel} />
                <Field label="Vencimento" value={contract.condicoes.vencimento} />
                <Field label="Índice" value={contract.condicoes.indice} />
                <Field label="Periodicidade" value={contract.condicoes.periodicidade} />
                <Field label="Condomínio" value={contract.condicoes.condominio} />
                <Field label="IPTU" value={contract.condicoes.iptu} />
                <Field label="Multa moratória" value={contract.condicoes.multaMoratoria} />
                <Field label="Juros" value={contract.condicoes.jurosMora} />
                <Field label="Multa rescisória" value={contract.condicoes.multaRescisoria} />
                <Field label="Prazo" value={contract.condicoes.prazo} />
              </FieldGrid>
            </Panel>
          </div>
        ) : null}

        {tab === "documentos" ? (
          <Panel title="Versões do documento">
            {contract.documentos.length === 0 ? (
              <EmptyState
                title="Nenhuma versão gerada"
                description="O documento é gerado após a aprovação na análise."
              />
            ) : (
              <Table head={["Versão", "Data", "Status", "Hash", "Ações"]}>
                {contract.documentos.map((d) => (
                  <tr key={d.hash}>
                    <Td className="font-medium">{d.versao}</Td>
                    <Td className="text-muted-foreground">{d.geradoEm}</Td>
                    <Td>{d.status === "Substituída" ? "OBSOLETO" : d.status.toUpperCase()}</Td>
                    <Td className="font-mono text-xs">{d.hash}</Td>
                    <Td>
                      <div className="flex gap-2">
                        <Button onClick={() => setDocView(d.versao)}>Visualizar</Button>
                        <Button
                          onClick={() =>
                            setNotice(`Download simulado de ${contract.numero} ${d.versao}.`)
                          }
                        >
                          Baixar
                        </Button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </Table>
            )}
            {docView ? (
              <div className="mt-4 border border-dashed border-border p-4 text-sm">
                <p className="font-medium">
                  Contrato de locação — {contract.numero} ({docView})
                </p>
                <p className="mt-2 text-muted-foreground">
                  Locador {landlordName(contract)} loca a {tenantName(contract)} o imóvel{" "}
                  {propertyLabel(contract.propertyId)}, pelo aluguel de {contract.condicoes.aluguel}
                  , com garantia {GUARANTEE_LABEL[contract.garantia.tipo]}. Documento mockado para
                  validação de UX.
                </p>
                <Button onClick={() => setDocView(null)}>Fechar</Button>
              </div>
            ) : null}
          </Panel>
        ) : null}

        {tab === "assinaturas" ? (
          <Panel
            title="Assinaturas"
            aside={
              totalSig ? (
                <span className="text-xs text-muted-foreground">
                  {pending} de {totalSig} assinaturas pendentes
                </span>
              ) : null
            }
          >
            {totalSig === 0 ? (
              <EmptyState
                title="Nenhuma solicitação enviada"
                description="Disponível após o envio para assinatura."
              />
            ) : (
              <>
                <Callout>
                  {pending === 0
                    ? "Todas as assinaturas foram coletadas."
                    : `${pending} de ${totalSig} assinaturas pendentes`}
                </Callout>
                <div className="mt-3">
                  <Table head={["Signatário", "Papel", "Status", "Data"]}>
                    {contract.assinaturas.map((s, i) => (
                      <tr key={`${s.clientId}-${i}`}>
                        <Td>{getClient(s.clientId)?.nome ?? "—"}</Td>
                        <Td className="text-muted-foreground">{ROLE_LABEL[s.role]}</Td>
                        <Td>{s.status}</Td>
                        <Td className="text-muted-foreground">{s.assinadoEm ?? "—"}</Td>
                      </tr>
                    ))}
                  </Table>
                </div>
                {contract.status === "AGUARDANDO_ASSINATURAS" ? (
                  <div className="mt-3">
                    <Button
                      onClick={() => {
                        resendSignatureRequest(contract.id);
                        setNotice("Solicitação reenviada aos signatários pendentes.");
                      }}
                    >
                      Reenviar solicitação
                    </Button>
                  </div>
                ) : null}
              </>
            )}
          </Panel>
        ) : null}

        {tab === "historico" ? (
          <Panel title="Histórico do contrato">
            {contract.historico.length === 0 ? (
              <EmptyState title="Sem eventos" />
            ) : (
              <Timeline items={contract.historico} />
            )}
          </Panel>
        ) : null}

        <ConfirmDialog
          open={cancelOpen}
          title="Cancelar contrato"
          description="Esta ação marca o contrato como CANCELADO no protótipo. Confirma?"
          confirmLabel="Cancelar contrato"
          destructive
          onCancel={() => setCancelOpen(false)}
          onConfirm={() => {
            cancelContract(contract.id);
            setCancelOpen(false);
            setNotice("Contrato cancelado.");
            navigate({ to: "/contratos/$id", params: { id: contract.id } });
          }}
        />
      </AdminLayout>
    </ChildOutlet>
  );
}
