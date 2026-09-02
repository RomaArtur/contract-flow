import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { PortalLayout } from "@/components/PortalLayout";
import { Button, Callout, PageHeader, Panel, SuccessState } from "@/components/wire";
import { getContract, useAppStore } from "@/data/store";

export const Route = createFileRoute("/portal/$id/conclusao")({
  loader: ({ params }) => {
    const contract = getContract(params.id);
    if (!contract) throw notFound();
    return { numero: contract.numero };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `Conclusão ${loaderData?.numero ?? ""} | Área do cliente` },
      { name: "description", content: "Assinatura realizada e acesso ao documento final." },
      { property: "og:title", content: "Contrato assinado" },
      { property: "og:description", content: "Documento final disponível." },
    ],
  }),
  component: PortalDone,
});

function PortalDone() {
  const { id } = Route.useParams();
  useAppStore();
  const contract = getContract(id)!;
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <PortalLayout>
      <PageHeader title="Conclusão" />
      <SuccessState title="Assinatura realizada com sucesso." description="Contrato assinado." />
      {notice ? <Callout tone="success">{notice}</Callout> : null}
      <Panel title="Documento final">
        <p className="text-sm text-muted-foreground">
          Versão vigente de {contract.numero}. Ações abaixo são simuladas neste protótipo.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/portal/$id/documento" params={{ id }}>
            <Button variant="primary">Visualizar documento final</Button>
          </Link>
          <Button onClick={() => setNotice(`Download simulado de ${contract.numero}.`)}>
            Baixar documento
          </Button>
        </div>
      </Panel>
    </PortalLayout>
  );
}
