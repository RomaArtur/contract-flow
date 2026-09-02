import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AdminLayout } from "@/components/AdminLayout";
import {
  Button,
  EmptyState,
  Field,
  FieldGrid,
  PageHeader,
  Panel,
  StatusBadge,
  Table,
  Td,
} from "@/components/wire";
import { ROLE_LABEL } from "@/data/mock";
import { getClient, propertyLabel, useAppStore } from "@/data/store";

export const Route = createFileRoute("/clientes/$id")({
  loader: ({ params }) => {
    const client = getClient(params.id);
    if (!client) throw notFound();
    return { nome: client.nome };
  },
  head: ({ loaderData }) => {
    const nome = loaderData?.nome ?? "Cliente";
    return {
      meta: [
        { title: `${nome} | Clientes` },
        { name: "description", content: `Dados cadastrais e contratos vinculados a ${nome}.` },
        { property: "og:title", content: `${nome} | Clientes` },
        { property: "og:description", content: `Contratos de locação vinculados a ${nome}.` },
        ...(loaderData ? [] : [{ name: "robots", content: "noindex" }]),
      ],
    };
  },
  component: ClientDetail,
});

function ClientDetail() {
  const { id } = Route.useParams();
  const { contracts } = useAppStore();
  const client = getClient(id)!;
  const vinculados = contracts.filter((c) => c.partes.some((p) => p.clientId === id));

  return (
    <AdminLayout>
      <PageHeader
        title={client.nome}
        description={`Cliente ${client.tipo} · ${client.documento}`}
        actions={
          <Link to="/clientes/$id/editar" params={{ id }}>
            <Button>Editar</Button>
          </Link>
        }
      />
      <Panel title="Dados cadastrais">
        <FieldGrid>
          <Field label="Nome" value={client.nome} />
          <Field label="Tipo" value={client.tipo === "PF" ? "Pessoa física" : "Pessoa jurídica"} />
          <Field label="Documento" value={client.documento} />
          <Field label="E-mail" value={client.email} />
          <Field label="Telefone" value={client.telefone} />
        </FieldGrid>
      </Panel>
      <Panel title="Contratos vinculados">
        {vinculados.length === 0 ? (
          <EmptyState title="Nenhum contrato vinculado" />
        ) : (
          <Table head={["Número", "Papel", "Imóvel", "Status", ""]}>
            {vinculados.map((c) => (
              <tr key={c.id}>
                <Td>
                  <Link to="/contratos/$id" params={{ id: c.id }} className="underline">
                    {c.numero}
                  </Link>
                </Td>
                <Td className="text-muted-foreground">
                  {c.partes
                    .filter((p) => p.clientId === id)
                    .map((p) => ROLE_LABEL[p.role])
                    .join(", ")}
                </Td>
                <Td className="text-muted-foreground">{propertyLabel(c.propertyId)}</Td>
                <Td>
                  <StatusBadge status={c.status} />
                </Td>
                <Td>
                  <Link to="/contratos/$id" params={{ id: c.id }} className="text-sm underline">
                    Abrir
                  </Link>
                </Td>
              </tr>
            ))}
          </Table>
        )}
      </Panel>
    </AdminLayout>
  );
}
