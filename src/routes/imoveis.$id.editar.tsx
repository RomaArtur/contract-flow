import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { AdminLayout } from "@/components/AdminLayout";
import { PropertyForm } from "@/components/PropertyForm";
import { Button, PageHeader, Panel } from "@/components/wire";
import { getProperty, updateProperty } from "@/data/store";

export const Route = createFileRoute("/imoveis/$id/editar")({
  loader: ({ params }) => {
    const property = getProperty(params.id);
    if (!property) throw notFound();
    return { codigo: property.codigo };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `Editar ${loaderData?.codigo ?? "imóvel"}` },
      { name: "description", content: "Edição cadastral do imóvel." },
      { property: "og:title", content: "Editar imóvel" },
      { property: "og:description", content: "Atualizar endereço e características." },
    ],
  }),
  component: EditPropertyPage,
});

function EditPropertyPage() {
  const { id } = Route.useParams();
  const property = getProperty(id)!;
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <PageHeader
        title={`Editar ${property.codigo}`}
        actions={
          <Link to="/imoveis/$id" params={{ id }}>
            <Button>Cancelar</Button>
          </Link>
        }
      />
      <Panel title="Dados do imóvel">
        <PropertyForm
          initial={property}
          submitLabel="Salvar alterações"
          onSubmit={(data) => {
            updateProperty(id, { ...data, codigo: property.codigo });
            navigate({ to: "/imoveis/$id", params: { id } });
          }}
        />
      </Panel>
    </AdminLayout>
  );
}
