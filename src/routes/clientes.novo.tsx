import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AdminLayout } from "@/components/AdminLayout";
import { ClientForm } from "@/components/ClientForm";
import { PageHeader, Panel } from "@/components/wire";
import { createClient } from "@/data/store";

export const Route = createFileRoute("/clientes/novo")({
  head: () => ({
    meta: [
      { title: "Novo cliente | Gestão de Contratos" },
      { name: "description", content: "Cadastro de cliente para uso como parte em contratos." },
      { property: "og:title", content: "Novo cliente" },
      {
        property: "og:description",
        content: "Cadastrar locador, locatário, fiador ou testemunha.",
      },
    ],
  }),
  component: NewClientPage,
});

function NewClientPage() {
  const navigate = useNavigate();
  return (
    <AdminLayout>
      <PageHeader
        title="Novo cliente"
        description="Dados necessários para vincular a pessoa a um contrato."
      />
      <Panel title="Cadastro">
        <ClientForm
          submitLabel="Salvar cliente"
          onSubmit={(data) => {
            const c = createClient(data);
            navigate({ to: "/clientes/$id", params: { id: c.id } });
          }}
        />
      </Panel>
    </AdminLayout>
  );
}
