import { createFileRoute, Link } from "@tanstack/react-router";
import { PortalLayout } from "@/components/PortalLayout";
import { Button, EmptyState, PageHeader, Panel, StatusBadge, Table, Td } from "@/components/wire";
import { PORTAL_CLIENT_ID } from "@/data/mock";
import { portalContractsFor, propertyLabel, useAppStore } from "@/data/store";

export const Route = createFileRoute("/portal/")({
  head: () => ({
    meta: [
      { title: "Área do cliente | Contract Flow" },
      { name: "description", content: "Acesse seus contratos de locação, visualize e assine." },
      { property: "og:title", content: "Área do cliente" },
      { property: "og:description", content: "Contratos do cliente." },
    ],
  }),
  component: PortalHome,
});

function PortalHome() {
  useAppStore();
  const list = portalContractsFor(PORTAL_CLIENT_ID);

  return (
    <PortalLayout>
      <PageHeader
        title="Seus contratos"
        description="Visualize o documento, acompanhe o status e assine quando solicitado."
      />
      <Panel title="Contratos">
        {list.length === 0 ? (
          <EmptyState title="Nenhum contrato disponível" />
        ) : (
          <Table head={["Contrato", "Imóvel", "Status", ""]}>
            {list.map((c) => (
              <tr key={c.id}>
                <Td className="font-medium">{c.numero}</Td>
                <Td className="text-muted-foreground">{propertyLabel(c.propertyId)}</Td>
                <Td>
                  <StatusBadge status={c.status} />
                </Td>
                <Td>
                  <Link to="/portal/$id" params={{ id: c.id }}>
                    <Button variant="primary">Acessar contrato</Button>
                  </Link>
                </Td>
              </tr>
            ))}
          </Table>
        )}
      </Panel>
    </PortalLayout>
  );
}
