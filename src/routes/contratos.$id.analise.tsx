import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import {
  Button,
  Callout,
  ConfirmDialog,
  Field,
  FieldGrid,
  PageHeader,
  Panel,
  Select,
  StatusBadge,
} from "@/components/wire";
import { GUARANTEE_LABEL, ROLE_LABEL } from "@/data/mock";
import {
  approveContract,
  getAnalysis,
  getClient,
  getContract,
  landlordName,
  propertyLabel,
  refuseContract,
  setAnalysisItem,
  tenantName,
  useAppStore,
  type CheckStatus,
} from "@/data/store";

export const Route = createFileRoute("/contratos/$id/analise")({
  loader: ({ params }) => {
    const contract = getContract(params.id);
    if (!contract) throw notFound();
    return { numero: contract.numero };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `Análise ${loaderData?.numero ?? ""} | Contratos` },
      { name: "description", content: "Checklist de análise do contrato de locação." },
      { property: "og:title", content: "Análise de contrato" },
      { property: "og:description", content: "Validar, reprovar itens e decidir o contrato." },
    ],
  }),
  component: AnalysisPage,
});

const STATUS_OPTIONS: { value: CheckStatus; label: string }[] = [
  { value: "PENDENTE", label: "Pendente" },
  { value: "VALIDADO", label: "Validado" },
  { value: "REPROVADO", label: "Reprovado" },
];

function AnalysisPage() {
  const { id } = Route.useParams();
  useAppStore();
  const contract = getContract(id)!;
  const items = getAnalysis(id) ?? [];
  const [notice, setNotice] = useState<string | null>(null);
  const [refuseOpen, setRefuseOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);

  if (contract.status !== "EM_ANALISE") {
    return (
      <AdminLayout>
        <PageHeader
          title={`Análise — ${contract.numero}`}
          description="Esta tela vale para contratos em análise."
        />
        <Callout>
          O contrato está com status {contract.status}.{" "}
          <Link to="/contratos/$id" params={{ id }} className="underline">
            Voltar aos detalhes
          </Link>
        </Callout>
      </AdminLayout>
    );
  }

  const locador = contract.partes.find((p) => p.role === "LOCADOR");
  const locatario = contract.partes.find((p) => p.role === "LOCATARIO");

  return (
    <AdminLayout>
      <PageHeader
        title={`Análise — ${contract.numero}`}
        description="Checklist operacional. Aprovar ou recusar simula a decisão da análise."
        actions={
          <Link to="/contratos/$id" params={{ id }}>
            <Button>Voltar aos detalhes</Button>
          </Link>
        }
      />
      <StatusBadge status={contract.status} />
      {notice ? (
        <Callout tone={notice.includes("recusado") ? "error" : "success"}>{notice}</Callout>
      ) : null}

      <Panel title="Contexto">
        <FieldGrid>
          <Field label="Imóvel" value={propertyLabel(contract.propertyId)} />
          <Field label="Locador" value={landlordName(contract)} />
          <Field label="Locatário" value={tenantName(contract)} />
          <Field label="Garantia" value={GUARANTEE_LABEL[contract.garantia.tipo]} />
        </FieldGrid>
      </Panel>

      <Panel title="Checklist">
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-3 border border-border p-3"
            >
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                {item.id === "locador" && locador ? (
                  <p className="text-xs text-muted-foreground">
                    {getClient(locador.clientId)?.nome} · {ROLE_LABEL.LOCADOR}
                  </p>
                ) : null}
                {item.id === "locatario" && locatario ? (
                  <p className="text-xs text-muted-foreground">
                    {getClient(locatario.clientId)?.nome}
                  </p>
                ) : null}
              </div>
              <div className="w-44">
                <Select
                  label="Estado"
                  value={item.status}
                  onChange={(v) => setAnalysisItem(id, item.id, v as CheckStatus)}
                  options={STATUS_OPTIONS}
                />
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <div className="flex flex-wrap gap-2">
        <Button variant="primary" onClick={() => setApproveOpen(true)}>
          Aprovar contrato
        </Button>
        <Button variant="danger" onClick={() => setRefuseOpen(true)}>
          Recusar contrato
        </Button>
      </div>

      <ConfirmDialog
        open={approveOpen}
        title="Aprovar contrato"
        description="O status passará para PRONTO_PARA_ASSINATURA e uma versão de documento será gerada."
        confirmLabel="Aprovar"
        onCancel={() => setApproveOpen(false)}
        onConfirm={() => {
          approveContract(id);
          setApproveOpen(false);
          setNotice("Contrato aprovado.");
        }}
      />
      <ConfirmDialog
        open={refuseOpen}
        title="Recusar contrato"
        description="O status passará para RECUSADO. Esta ação é simulada no protótipo."
        confirmLabel="Recusar"
        destructive
        onCancel={() => setRefuseOpen(false)}
        onConfirm={() => {
          refuseContract(id);
          setRefuseOpen(false);
          setNotice("Contrato recusado.");
        }}
      />
    </AdminLayout>
  );
}
