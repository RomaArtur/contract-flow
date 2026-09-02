import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AdminLayout } from "@/components/AdminLayout";
import { PropertyForm } from "@/components/PropertyForm";
import { PageHeader, Panel } from "@/components/wire";
import { createProperty } from "@/data/store";

export const Route = createFileRoute("/imoveis/novo")({
  head: () => ({
    meta: [
      { title: "Novo imóvel | Gestão de Contratos" },
      { name: "description", content: "Cadastro de imóvel para contratos de locação." },
      { property: "og:title", content: "Novo imóvel" },
      { property: "og:description", content: "Informe CEP e endereço do imóvel." },
    ],
  }),
  component: NewPropertyPage,
});

function NewPropertyPage() {
  const navigate = useNavigate();
  return (
    <AdminLayout>
      <PageHeader
        title="Novo imóvel"
        description="CEP mockado preenche o endereço. Complemente e confirme."
      />
      <Panel title="Cadastro">
        <PropertyForm
          submitLabel="Salvar imóvel"
          onSubmit={(data) => {
            const p = createProperty(data);
            navigate({ to: "/imoveis/$id", params: { id: p.id } });
          }}
        />
      </Panel>
    </AdminLayout>
  );
}
