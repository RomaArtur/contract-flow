import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PortalLayout } from "@/components/PortalLayout";
import { Button, Callout, ConfirmDialog, PageHeader, Panel } from "@/components/wire";
import { PORTAL_CLIENT_ID } from "@/data/mock";
import { getContract, signAsPortalClient, useAppStore } from "@/data/store";

export const Route = createFileRoute("/portal/$id/assinatura")({
  loader: ({ params }) => {
    const contract = getContract(params.id);
    if (!contract) throw notFound();
    return { numero: contract.numero };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `Assinar ${loaderData?.numero ?? ""} | Área do cliente` },
      { name: "description", content: "Simulação de assinatura do contrato." },
      { property: "og:title", content: "Assinar contrato" },
      { property: "og:description", content: "Confirme a assinatura do contrato de locação." },
    ],
  }),
  component: PortalSign,
});

function PortalSign() {
  const { id } = Route.useParams();
  useAppStore();
  const contract = getContract(id)!;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const mySig = contract.assinaturas.find((s) => s.clientId === PORTAL_CLIENT_ID);
  const already = mySig?.status === "ASSINADO";

  return (
    <PortalLayout>
      <PageHeader title="Assinatura" description={`Contrato ${contract.numero}`} />
      {already ? (
        <Callout tone="success">Assinatura já registrada neste contrato.</Callout>
      ) : (
        <Panel title="Confirmação">
          <p className="text-sm text-muted-foreground">
            Ao confirmar, você declara ter lido o documento e concorda com as condições comerciais
            apresentadas. Esta é uma assinatura simulada do protótipo.
          </p>
          <div className="mt-4">
            <Button variant="primary" onClick={() => setOpen(true)}>
              Confirmar assinatura
            </Button>
          </div>
        </Panel>
      )}
      <Link to="/portal/$id/documento" params={{ id }}>
        <Button>Voltar ao documento</Button>
      </Link>
      <ConfirmDialog
        open={open}
        title="Assinar contrato"
        description="Registrar a assinatura do locatário neste protótipo?"
        confirmLabel="Assinar"
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          signAsPortalClient(id, PORTAL_CLIENT_ID);
          setOpen(false);
          navigate({ to: "/portal/$id/conclusao", params: { id } });
        }}
      />
    </PortalLayout>
  );
}
