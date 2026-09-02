import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PortalLayout } from "@/components/PortalLayout";
import {
  Button,
  Callout,
  Field,
  FieldGrid,
  PageHeader,
  Panel,
  StatusBadge,
} from "@/components/wire";
import { PORTAL_CLIENT_ID } from "@/data/mock";
import { getContract, propertyLabel, tenantName, useAppStore } from "@/data/store";

export const Route = createFileRoute("/portal/$id")({
  loader: ({ params }) => {
    const contract = getContract(params.id);
    if (!contract) throw notFound();
    return { numero: contract.numero };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.numero ?? "Contrato"} | Área do cliente` },
      { name: "description", content: "Acesso ao contrato de locação do cliente." },
      { property: "og:title", content: "Contrato do cliente" },
      { property: "og:description", content: "Status e acesso ao documento." },
    ],
  }),
  component: PortalContract,
});

function PortalContract() {
  const { id } = Route.useParams();
  useAppStore();
  const contract = getContract(id)!;
  const mySig = contract.assinaturas.find((s) => s.clientId === PORTAL_CLIENT_ID);
  const canSign = contract.status === "AGUARDANDO_ASSINATURAS" && mySig?.status === "PENDENTE";
  const signed =
    mySig?.status === "ASSINADO" ||
    contract.status === "ASSINADO" ||
    contract.status === "ATIVO" ||
    contract.status === "ENCERRADO";

  return (
    <PortalLayout>
      <PageHeader title={contract.numero} description="Informações básicas do seu contrato." />
      <StatusBadge status={contract.status} />
      <Panel title="Resumo">
        <FieldGrid cols={2}>
          <Field label="Imóvel" value={propertyLabel(contract.propertyId)} />
          <Field label="Locatário" value={tenantName(contract)} />
          <Field label="Início" value={contract.inicio} />
          <Field label="Término" value={contract.termino} />
          <Field label="Aluguel" value={contract.condicoes.aluguel} />
          <Field label="Sua assinatura" value={mySig?.status ?? "Não solicitada"} />
        </FieldGrid>
      </Panel>
      {canSign ? <Callout>Há uma assinatura pendente neste contrato.</Callout> : null}
      <div className="flex flex-wrap gap-2">
        <Link to="/portal/$id/documento" params={{ id }}>
          <Button variant="primary">Visualizar contrato</Button>
        </Link>
        {signed ? (
          <Link to="/portal/$id/conclusao" params={{ id }}>
            <Button>Documento final</Button>
          </Link>
        ) : null}
      </div>
    </PortalLayout>
  );
}
