import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminLayout } from "@/components/AdminLayout";
import { ChildOutlet } from "@/components/ChildOutlet";
import { EmptyState, PageHeader, Panel, Table, Td } from "@/components/wire";
import { useAppStore } from "@/data/store";

export const Route = createFileRoute("/auditoria")({
  head: () => ({
    meta: [
      { title: "Auditoria | Gestão de Contratos de Locação" },
      {
        name: "description",
        content: "Rastreabilidade técnica: usuário, ação, entidade, registro e data/hora.",
      },
      { property: "og:title", content: "Auditoria | Gestão de Contratos" },
      { property: "og:description", content: "Eventos de auditoria do protótipo." },
    ],
  }),
  component: AuditPage,
});

function AuditPage() {
  const { auditEvents } = useAppStore();

  return (
    <ChildOutlet>
      <AdminLayout>
        <PageHeader
          title="Auditoria"
          description="Rastreabilidade técnica das ações sobre contratos, clientes e imóveis."
        />
        <Panel title={`Eventos (${auditEvents.length})`}>
          {auditEvents.length === 0 ? (
            <EmptyState title="Nenhum evento" />
          ) : (
            <Table head={["Data/hora", "Usuário", "Ação", "Entidade", "Registro", ""]}>
              {auditEvents.map((e) => (
                <tr key={e.id} className="hover:bg-accent">
                  <Td className="text-muted-foreground">{e.dataHora}</Td>
                  <Td>{e.usuario}</Td>
                  <Td>{e.acao}</Td>
                  <Td className="text-muted-foreground">{e.entidade}</Td>
                  <Td className="text-muted-foreground">{e.registro}</Td>
                  <Td>
                    <Link to="/auditoria/$id" params={{ id: e.id }} className="text-sm underline">
                      Abrir
                    </Link>
                  </Td>
                </tr>
              ))}
            </Table>
          )}
        </Panel>
      </AdminLayout>
    </ChildOutlet>
  );
}
