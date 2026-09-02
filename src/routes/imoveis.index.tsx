import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { EmptyState, Input, PageHeader, Panel, Table, Td } from "@/components/wire";
import { contracts, properties } from "@/data/mock";

export const Route = createFileRoute("/imoveis/")({
  head: () => ({
    meta: [
      { title: "Imóveis | Gestão de Contratos de Locação" },
      { name: "description", content: "Cadastro de imóveis disponíveis para contratos de locação." },
      { property: "og:title", content: "Imóveis | Gestão de Contratos de Locação" },
      { property: "og:description", content: "Endereços, tipos e contratos vinculados a cada imóvel." },
    ],
  }),
  component: PropertiesPage,
});

function PropertiesPage() {
  const [busca, setBusca] = useState("");
  const filtrados = properties.filter((p) =>
    `${p.codigo} ${p.logradouro} ${p.bairro} ${p.cidade} ${p.cep}`
      .toLowerCase()
      .includes(busca.trim().toLowerCase()),
  );

  return (
    <AdminLayout>
      <PageHeader title="Imóveis" description="Imóveis cadastrados e seus contratos." />
      <Panel title="Busca">
        <div className="max-w-md">
          <Input label="Busca" placeholder="Código, endereço ou CEP" value={busca} onChange={setBusca} />
        </div>
      </Panel>
      <Panel title={`Resultados (${filtrados.length})`}>
        {filtrados.length === 0 ? (
          <EmptyState title="Nenhum imóvel encontrado" description="Ajuste os termos da busca." />
        ) : (
          <Table head={["Código", "Endereço", "Tipo", "Área", "Contratos", ""]}>
            {filtrados.map((p) => (
              <tr key={p.id} className="hover:bg-accent">
                <Td>
                  <Link to="/imoveis/$id" params={{ id: p.id }} className="font-medium underline">
                    {p.codigo}
                  </Link>
                </Td>
                <Td className="text-muted-foreground">
                  {p.logradouro}, {p.numero} — {p.bairro}, {p.cidade}/{p.uf}
                </Td>
                <Td className="text-muted-foreground">{p.tipo}</Td>
                <Td className="text-muted-foreground">{p.area}</Td>
                <Td className="text-muted-foreground">
                  {contracts.filter((c) => c.propertyId === p.id).length}
                </Td>
                <Td>
                  <Link to="/imoveis/$id" params={{ id: p.id }} className="text-sm underline">
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
