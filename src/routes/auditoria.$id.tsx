import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AdminLayout } from "@/components/AdminLayout";
import { Button, Field, FieldGrid, PageHeader, Panel } from "@/components/wire";
import { getAuditEvent } from "@/data/store";

export const Route = createFileRoute("/auditoria/$id")({
  loader: ({ params }) => {
    const event = getAuditEvent(params.id);
    if (!event) throw notFound();
    return { acao: event.acao, registro: event.registro };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `Evento ${loaderData?.acao ?? ""} | Auditoria` },
      {
        name: "description",
        content: "Detalhe do evento de auditoria com dados anteriores e posteriores.",
      },
      { property: "og:title", content: "Detalhe de auditoria" },
      { property: "og:description", content: "Antes, depois, IP e User-Agent." },
    ],
  }),
  component: AuditDetail,
});

function AuditDetail() {
  const { id } = Route.useParams();
  const e = getAuditEvent(id)!;

  return (
    <AdminLayout>
      <PageHeader
        title={`${e.acao} · ${e.registro}`}
        description={e.dataHora}
        actions={
          <Link to="/auditoria">
            <Button>Voltar à auditoria</Button>
          </Link>
        }
      />
      <Panel title="Evento">
        <FieldGrid>
          <Field label="Usuário" value={e.usuario} />
          <Field label="Entidade" value={e.entidade} />
          <Field label="Ação" value={e.acao} />
          <Field label="Registro" value={e.registro} />
          <Field label="Data/hora" value={e.dataHora} />
          <Field label="IP" value={e.ip} />
        </FieldGrid>
        <div className="mt-4">
          <Field label="User-Agent" value={e.userAgent} />
        </div>
      </Panel>
      <Panel title="Dados anteriores">
        <pre className="overflow-x-auto text-xs text-muted-foreground">{e.antes}</pre>
      </Panel>
      <Panel title="Dados posteriores">
        <pre className="overflow-x-auto text-xs text-muted-foreground">{e.depois}</pre>
      </Panel>
    </AdminLayout>
  );
}
