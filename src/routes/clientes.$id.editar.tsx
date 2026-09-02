import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { AdminLayout } from "@/components/AdminLayout";
import { ClientForm } from "@/components/ClientForm";
import { Button, PageHeader, Panel } from "@/components/wire";
import { getClient, updateClient } from "@/data/store";

export const Route = createFileRoute("/clientes/$id/editar")({
  loader: ({ params }) => {
    const client = getClient(params.id);
    if (!client) throw notFound();
    return { nome: client.nome };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `Editar ${loaderData?.nome ?? "cliente"}` },
      { name: "description", content: "Edição cadastral do cliente." },
      { property: "og:title", content: "Editar cliente" },
      { property: "og:description", content: "Atualizar dados da parte contratual." },
    ],
  }),
  component: EditClientPage,
});

function EditClientPage() {
  const { id } = Route.useParams();
  const client = getClient(id)!;
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <PageHeader
        title={`Editar ${client.nome}`}
        actions={
          <Link to="/clientes/$id" params={{ id }}>
            <Button>Cancelar</Button>
          </Link>
        }
      />
      <Panel title="Dados cadastrais">
        <ClientForm
          initial={client}
          submitLabel="Salvar alterações"
          onSubmit={(data) => {
            updateClient(id, data);
            navigate({ to: "/clientes/$id", params: { id } });
          }}
        />
      </Panel>
    </AdminLayout>
  );
}
