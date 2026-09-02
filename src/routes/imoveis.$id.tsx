import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AdminLayout } from "@/components/AdminLayout";
import { ChildOutlet } from "@/components/ChildOutlet";
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
import { getProperty, tenantName, useAppStore } from "@/data/store";

export const Route = createFileRoute("/imoveis/$id")({
  loader: ({ params }) => {
    const property = getProperty(params.id);
    if (!property) throw notFound();
    return { codigo: property.codigo, endereco: `${property.logradouro}, ${property.numero}` };
  },
  head: ({ loaderData }) => {
    const codigo = loaderData?.codigo ?? "Imóvel";
    return {
      meta: [
        { title: `${codigo} | Imóveis` },
        {
          name: "description",
          content: `Dados do imóvel ${codigo}${loaderData ? ` — ${loaderData.endereco}` : ""} e contratos vinculados.`,
        },
        { property: "og:title", content: `${codigo} | Imóveis` },
        { property: "og:description", content: `Endereço e contratos do imóvel ${codigo}.` },
        ...(loaderData ? [] : [{ name: "robots", content: "noindex" }]),
      ],
    };
  },
  component: PropertyDetail,
});

function PropertyDetail() {
  const { id } = Route.useParams();
  const { contracts } = useAppStore();
  const p = getProperty(id)!;
  const vinculados = contracts.filter((c) => c.propertyId === id);

  return (
    <ChildOutlet>
      <AdminLayout>
        <PageHeader
          title={p.codigo}
          description={`${p.tipo} · ${p.cidade}/${p.uf}`}
          actions={
            <Link to="/imoveis/$id/editar" params={{ id }}>
              <Button>Editar</Button>
            </Link>
          }
        />
        <Panel title="Endereço">
          <FieldGrid>
            <Field label="CEP" value={p.cep} />
            <Field label="Logradouro" value={p.logradouro} />
            <Field label="Número" value={p.numero} />
            <Field label="Complemento" value={p.complemento ?? "—"} />
            <Field label="Bairro" value={p.bairro} />
            <Field label="Cidade / UF" value={`${p.cidade}/${p.uf}`} />
            <Field label="Tipo" value={p.tipo} />
            <Field label="Área" value={p.area} />
          </FieldGrid>
        </Panel>
        <Panel title="Contratos vinculados">
          {vinculados.length === 0 ? (
            <EmptyState title="Nenhum contrato vinculado" />
          ) : (
            <Table head={["Número", "Locatário", "Status", "Início", "Término", ""]}>
              {vinculados.map((c) => (
                <tr key={c.id}>
                  <Td>
                    <Link to="/contratos/$id" params={{ id: c.id }} className="underline">
                      {c.numero}
                    </Link>
                  </Td>
                  <Td className="text-muted-foreground">{tenantName(c)}</Td>
                  <Td>
                    <StatusBadge status={c.status} />
                  </Td>
                  <Td className="text-muted-foreground">{c.inicio}</Td>
                  <Td className="text-muted-foreground">{c.termino}</Td>
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
    </ChildOutlet>
  );
}
