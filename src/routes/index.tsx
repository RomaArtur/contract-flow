import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminLayout } from "@/components/AdminLayout";
import { PageHeader, Panel, StatusBadge, Table, Td, Button } from "@/components/wire";
import {
  contracts,
  propertyLabel,
  STATUS_LABEL,
  STATUS_ORDER,
  tenantName,
  type ContractStatus,
} from "@/data/mock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard operacional | Gestão de Contratos de Locação" },
      {
        name: "description",
        content:
          "Painel operacional de contratos de locação: rascunhos, análises, assinaturas pendentes e contratos ativos.",
      },
      { property: "og:title", content: "Dashboard operacional | Gestão de Contratos" },
      {
        property: "og:description",
        content: "O que precisa ser resolvido agora na carteira de contratos de locação.",
      },
    ],
  }),
  component: Dashboard,
});

const focusStatuses: ContractStatus[] = [
  "RASCUNHO",
  "EM_ANALISE",
  "PRONTO_PARA_ASSINATURA",
  "AGUARDANDO_ASSINATURAS",
  "ASSINADO",
  "ATIVO",
];

function Dashboard() {
  const pendencias = contracts.filter((c) => c.pendencia);

  return (
    <AdminLayout>
      <PageHeader
        title="Dashboard"
        description="O que eu preciso resolver agora."
        actions={
          <Link to="/contratos/novo">
            <Button variant="primary">Novo contrato</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {focusStatuses.map((status) => {
          const total = contracts.filter((c) => c.status === status).length;
          return (
            <Link
              key={status}
              to="/contratos"
              search={{ status }}
              className="border border-border bg-card p-4 hover:bg-accent"
            >
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                {STATUS_LABEL[status]}
              </p>
              <p className="mt-2 text-3xl font-semibold text-foreground">{total}</p>
              <p className="mt-1 text-xs text-muted-foreground">Ver contratos</p>
            </Link>
          );
        })}
      </div>

      <Panel title="Pendências que exigem atenção">
        <Table head={["Contrato", "Imóvel", "Status", "Pendência", ""]}>
          {pendencias.map((c) => (
            <tr key={c.id}>
              <Td>
                <span className="font-medium">{c.numero}</span>
              </Td>
              <Td className="text-muted-foreground">{propertyLabel(c.propertyId)}</Td>
              <Td>
                <StatusBadge status={c.status} />
              </Td>
              <Td className="text-muted-foreground">{c.pendencia}</Td>
              <Td>
                <Link
                  to="/contratos/$id"
                  params={{ id: c.id }}
                  className="text-sm underline text-foreground"
                >
                  Abrir
                </Link>
              </Td>
            </tr>
          ))}
        </Table>
      </Panel>

      <Panel title="Contratos atualizados recentemente">
        <Table head={["Número", "Locatário", "Status", "Última atualização"]}>
          {contracts.slice(0, 5).map((c) => (
            <tr key={c.id}>
              <Td>
                <Link to="/contratos/$id" params={{ id: c.id }} className="underline">
                  {c.numero}
                </Link>
              </Td>
              <Td className="text-muted-foreground">{tenantName(c)}</Td>
              <Td>
                <StatusBadge status={c.status} />
              </Td>
              <Td className="text-muted-foreground">{c.atualizadoEm}</Td>
            </tr>
          ))}
        </Table>
      </Panel>

      <p className="text-xs text-muted-foreground">
        Ciclo de vida: {STATUS_ORDER.slice(0, 7).map((s) => STATUS_LABEL[s]).join(" → ")}. Estados
        adicionais: Cancelado, Recusado.
      </p>
    </AdminLayout>
  );
}
