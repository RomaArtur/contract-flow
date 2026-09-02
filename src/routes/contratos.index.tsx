import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import {
  Button,
  EmptyState,
  Input,
  LoadingState,
  PageHeader,
  Pagination,
  Panel,
  Select,
  StatusBadge,
  Table,
  Td,
} from "@/components/wire";
import { getClient, propertyLabel, tenantName, useAppStore } from "@/data/store";
import { STATUS_LABEL, STATUS_ORDER, type ContractStatus } from "@/data/mock";

type Search = { status?: string };

export const Route = createFileRoute("/contratos/")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    status: typeof search["status"] === "string" ? search["status"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Contratos | Gestão de Contratos de Locação" },
      {
        name: "description",
        content:
          "Listagem de contratos de locação com busca e filtros por status, período, imóvel e parte.",
      },
      { property: "og:title", content: "Contratos | Gestão de Contratos de Locação" },
      { property: "og:description", content: "Busque e filtre todos os contratos da carteira." },
    ],
  }),
  component: ContractList,
});

function ContractList() {
  const { clients, contracts, properties } = useAppStore();
  const { status: statusFromUrl } = Route.useSearch();
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState<string>(statusFromUrl ?? "TODOS");
  const [imovel, setImovel] = useState("TODOS");
  const [parte, setParte] = useState("TODOS");
  const [periodo, setPeriodo] = useState("TODOS");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setStatus(statusFromUrl ?? "TODOS");
  }, [statusFromUrl]);

  const filtrados = contracts.filter((c) => {
    if (status !== "TODOS" && c.status !== status) return false;
    if (imovel !== "TODOS" && c.propertyId !== imovel) return false;
    if (parte !== "TODOS" && !c.partes.some((p) => p.clientId === parte)) return false;
    if (periodo !== "TODOS") {
      const ano = c.inicio.slice(-4);
      if (ano !== periodo) return false;
    }
    const termo = busca.trim().toLowerCase();
    if (
      termo &&
      !`${c.numero} ${propertyLabel(c.propertyId)} ${tenantName(c)}`.toLowerCase().includes(termo)
    )
      return false;
    return true;
  });

  const pageCount = Math.max(1, Math.ceil(filtrados.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pagina = filtrados.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <AdminLayout>
      <PageHeader
        title="Contratos"
        description="Núcleo da aplicação. Busque, filtre e abra os detalhes de cada contrato."
        actions={
          <Link to="/contratos/novo">
            <Button variant="primary">Novo contrato</Button>
          </Link>
        }
      />

      <Panel title="Busca e filtros">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
          <Input
            label="Busca"
            placeholder="Número, imóvel ou locatário"
            value={busca}
            onChange={setBusca}
          />
          <Select
            label="Status"
            value={status}
            onChange={setStatus}
            options={[
              { value: "TODOS", label: "Todos" },
              ...STATUS_ORDER.map((s) => ({ value: s, label: STATUS_LABEL[s as ContractStatus] })),
            ]}
          />
          <Select
            label="Período (início)"
            value={periodo}
            onChange={setPeriodo}
            options={[
              { value: "TODOS", label: "Todos" },
              { value: "2026", label: "2026" },
              { value: "2025", label: "2025" },
              { value: "2023", label: "2023" },
            ]}
          />
          <Select
            label="Imóvel"
            value={imovel}
            onChange={setImovel}
            options={[
              { value: "TODOS", label: "Todos" },
              ...properties.map((p) => ({ value: p.id, label: `${p.codigo} — ${p.logradouro}` })),
            ]}
          />
          <Select
            label="Parte do contrato"
            value={parte}
            onChange={setParte}
            options={[
              { value: "TODOS", label: "Todas" },
              ...clients.map((c) => ({ value: c.id, label: c.nome })),
            ]}
          />
        </div>
      </Panel>

      <Panel title={`Resultados (${filtrados.length})`}>
        {loading ? (
          <LoadingState rows={5} />
        ) : filtrados.length === 0 ? (
          <EmptyState
            title="Nenhum contrato encontrado"
            description="Ajuste a busca ou os filtros aplicados."
          />
        ) : (
          <Table
            head={[
              "Número",
              "Imóvel",
              "Locatário",
              "Status",
              "Início",
              "Término",
              "Última atualização",
              "",
            ]}
          >
            {pagina.map((c) => (
              <tr key={c.id} className="hover:bg-accent">
                <Td>
                  <Link to="/contratos/$id" params={{ id: c.id }} className="font-medium underline">
                    {c.numero}
                  </Link>
                </Td>
                <Td className="text-muted-foreground">{propertyLabel(c.propertyId)}</Td>
                <Td className="text-muted-foreground">
                  {getClient(c.partes.find((p) => p.role === "LOCATARIO")?.clientId ?? "")?.nome ??
                    "—"}
                </Td>
                <Td>
                  <StatusBadge status={c.status} />
                </Td>
                <Td className="text-muted-foreground">{c.inicio}</Td>
                <Td className="text-muted-foreground">{c.termino}</Td>
                <Td className="text-muted-foreground">{c.atualizadoEm}</Td>
                <Td>
                  <Link to="/contratos/$id" params={{ id: c.id }} className="text-sm underline">
                    Abrir
                  </Link>
                </Td>
              </tr>
            ))}
          </Table>
        )}
        <Pagination page={currentPage} pageCount={pageCount} onChange={setPage} />
      </Panel>
    </AdminLayout>
  );
}
