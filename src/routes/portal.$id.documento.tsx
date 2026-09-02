import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PortalLayout } from "@/components/PortalLayout";
import { Button, PageHeader, Panel, StatusBadge } from "@/components/wire";
import { GUARANTEE_LABEL, PORTAL_CLIENT_ID } from "@/data/mock";
import { getContract, landlordName, propertyLabel, tenantName, useAppStore } from "@/data/store";

export const Route = createFileRoute("/portal/$id/documento")({
  loader: ({ params }) => {
    const contract = getContract(params.id);
    if (!contract) throw notFound();
    return { numero: contract.numero };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `Documento ${loaderData?.numero ?? ""} | Área do cliente` },
      { name: "description", content: "Visualização do contrato de locação." },
      { property: "og:title", content: "Documento do contrato" },
      { property: "og:description", content: "Leia e assine o contrato." },
    ],
  }),
  component: PortalDocument,
});

function PortalDocument() {
  const { id } = Route.useParams();
  useAppStore();
  const contract = getContract(id)!;
  const mySig = contract.assinaturas.find((s) => s.clientId === PORTAL_CLIENT_ID);
  const canSign = contract.status === "AGUARDANDO_ASSINATURAS" && mySig?.status === "PENDENTE";
  const signed =
    mySig?.status === "ASSINADO" || ["ASSINADO", "ATIVO", "ENCERRADO"].includes(contract.status);

  return (
    <PortalLayout>
      <PageHeader
        title={`Documento — ${contract.numero}`}
        description="Representação mockada do instrumento de locação."
        actions={<StatusBadge status={contract.status} />}
      />
      <Panel title="Contrato de locação residencial / comercial">
        <div className="space-y-3 text-sm leading-relaxed text-foreground">
          <p>
            Pelo presente instrumento, o locador <strong>{landlordName(contract)}</strong> dá em
            locação a <strong>{tenantName(contract)}</strong> o imóvel{" "}
            {propertyLabel(contract.propertyId)}, pelo prazo de {contract.condicoes.prazo}, com
            início em {contract.inicio} e término em {contract.termino}.
          </p>
          <p>
            O aluguel mensal é de {contract.condicoes.aluguel}, vencível em{" "}
            {contract.condicoes.vencimento}, reajustado pelo índice {contract.condicoes.indice} (
            {contract.condicoes.periodicidade}).
          </p>
          <p>
            Encargos: condomínio {contract.condicoes.condominio}; IPTU {contract.condicoes.iptu}.
            Garantia: {GUARANTEE_LABEL[contract.garantia.tipo]} — {contract.garantia.detalhe}.
          </p>
          <p className="text-muted-foreground">
            Este texto é um wireframe para validação da jornada de leitura e assinatura. Não possui
            valor jurídico.
          </p>
        </div>
      </Panel>
      <div className="flex flex-wrap gap-2">
        {canSign ? (
          <Link to="/portal/$id/assinatura" params={{ id }}>
            <Button variant="primary">Assinar contrato</Button>
          </Link>
        ) : null}
        {signed ? (
          <Link to="/portal/$id/conclusao" params={{ id }}>
            <Button>Ver documento final</Button>
          </Link>
        ) : null}
        <Link to="/portal/$id" params={{ id }}>
          <Button>Voltar</Button>
        </Link>
      </div>
    </PortalLayout>
  );
}
