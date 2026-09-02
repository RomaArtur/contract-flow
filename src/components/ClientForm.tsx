import { useState } from "react";
import { Button, Input, Select } from "@/components/wire";
import type { Client } from "@/data/mock";

export function ClientForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: Partial<Client>;
  submitLabel: string;
  onSubmit: (data: Omit<Client, "id">) => void;
}) {
  const [nome, setNome] = useState(initial?.nome ?? "");
  const [tipo, setTipo] = useState<"PF" | "PJ">(initial?.tipo ?? "PF");
  const [documento, setDocumento] = useState(initial?.documento ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [telefone, setTelefone] = useState(initial?.telefone ?? "");
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="grid gap-3 md:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!nome.trim() || !documento.trim()) {
          setError("Nome e documento são obrigatórios.");
          return;
        }
        onSubmit({ nome, tipo, documento, email, telefone });
      }}
    >
      {error ? <p className="md:col-span-2 text-sm text-destructive">{error}</p> : null}
      <Input label="Nome" value={nome} onChange={setNome} />
      <Select
        label="Tipo"
        value={tipo}
        onChange={(v) => setTipo(v as "PF" | "PJ")}
        options={[
          { value: "PF", label: "Pessoa física" },
          { value: "PJ", label: "Pessoa jurídica" },
        ]}
      />
      <Input label="Documento (CPF/CNPJ)" value={documento} onChange={setDocumento} />
      <Input label="E-mail" value={email} onChange={setEmail} />
      <Input label="Telefone" value={telefone} onChange={setTelefone} />
      <div className="flex items-end">
        <Button type="submit" variant="primary">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
