import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button, EmptyState, Input, PageHeader, Panel, Table, Td } from "@/components/wire";
import { useAppStore } from "@/data/store";

export const Route = createFileRoute("/clientes/")({
  head: () => ({
    meta: [
      { title: "Clientes | Gestão de Contratos de Locação" },
      {
        name: "description",
        content: "Cadastro de clientes que participam dos contratos de locação.",
      },
      { property: "og:title", content: "Clientes | Gestão de Contratos de Locação" },
      {
        property: "og:description",
        content: "Locadores, locatários, fiadores e testemunhas da carteira.",
      },
    ],
  }),
  component: ClientsPage,
});

function ClientsPage() {
  const { clients, contracts } = useAppStore();
  const [busca, setBusca] = useState("");
  const filtrados = clients.filter((c) =>
    `${c.nome} ${c.documento} ${c.email}`.toLowerCase().includes(busca.trim().toLowerCase()),
  );

  return (
    <AdminLayout>
      <PageHeader
        title="Clientes"
        description="Pessoas e empresas vinculadas aos contratos."
        actions={
          <Link to="/clientes/novo">
            <Button variant="primary">Novo cliente</Button>
          </Link>
        }
      />
      <Panel title="Busca">
        <div className="max-w-md">
          <Input
            label="Busca"
            placeholder="Nome, documento ou e-mail"
            value={busca}
            onChange={setBusca}
          />
        </div>
      </Panel>
      <Panel title={`Resultados (${filtrados.length})`}>
        {filtrados.length === 0 ? (
          <EmptyState title="Nenhum cliente encontrado" description="Ajuste os termos da busca." />
        ) : (
          <Table head={["Nome", "Tipo", "Documento", "Contato", "Contratos", ""]}>
            {filtrados.map((c) => {
              const total = contracts.filter((ct) =>
                ct.partes.some((p) => p.clientId === c.id),
              ).length;
              return (
                <tr key={c.id} className="hover:bg-accent">
                  <Td>
                    <Link
                      to="/clientes/$id"
                      params={{ id: c.id }}
                      className="font-medium underline"
                    >
                      {c.nome}
                    </Link>
                  </Td>
                  <Td className="text-muted-foreground">{c.tipo}</Td>
                  <Td className="text-muted-foreground">{c.documento}</Td>
                  <Td className="text-muted-foreground">
                    {c.email}
                    <br />
                    {c.telefone}
                  </Td>
                  <Td className="text-muted-foreground">{total}</Td>
                  <Td>
                    <Link to="/clientes/$id" params={{ id: c.id }} className="text-sm underline">
                      Abrir
                    </Link>
                  </Td>
                </tr>
              );
            })}
          </Table>
        )}
      </Panel>
    </AdminLayout>
  );
}
