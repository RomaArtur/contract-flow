import { useState } from "react";
import { Button, Callout, Input, Select } from "@/components/wire";
import { formatCep, lookupCep } from "@/data/cep";
import type { Property } from "@/data/mock";

export function PropertyForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: Partial<Property>;
  submitLabel: string;
  onSubmit: (data: Omit<Property, "id" | "codigo"> & { codigo?: string }) => void;
}) {
  const [cep, setCep] = useState(initial?.cep ?? "");
  const [logradouro, setLogradouro] = useState(initial?.logradouro ?? "");
  const [numero, setNumero] = useState(initial?.numero ?? "");
  const [complemento, setComplemento] = useState(initial?.complemento ?? "");
  const [bairro, setBairro] = useState(initial?.bairro ?? "");
  const [cidade, setCidade] = useState(initial?.cidade ?? "");
  const [uf, setUf] = useState(initial?.uf ?? "");
  const [tipo, setTipo] = useState(initial?.tipo ?? "Apartamento");
  const [area, setArea] = useState(initial?.area ?? "");
  const [cepMsg, setCepMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!logradouro.trim() || !numero.trim()) {
          setError("Informe logradouro e número.");
          return;
        }
        onSubmit({
          cep: formatCep(cep),
          logradouro,
          numero,
          complemento: complemento || undefined,
          bairro,
          cidade,
          uf,
          tipo,
          area,
        });
      }}
    >
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <div className="grid gap-3 md:grid-cols-3">
        <Input label="CEP" value={cep} onChange={setCep} hint="Mock. Ex.: 01310-100" />
        <div className="flex items-end">
          <Button
            onClick={() => {
              const found = lookupCep(cep);
              if (!found) {
                setCepMsg("CEP não encontrado na base mockada.");
                return;
              }
              setCep(formatCep(cep));
              setLogradouro(found.logradouro);
              setBairro(found.bairro);
              setCidade(found.cidade);
              setUf(found.uf);
              setCepMsg("Endereço preenchido (dados mockados).");
            }}
          >
            Buscar CEP
          </Button>
        </div>
      </div>
      {cepMsg ? <Callout>{cepMsg}</Callout> : null}
      <div className="grid gap-3 md:grid-cols-2">
        <Input label="Logradouro" value={logradouro} onChange={setLogradouro} />
        <Input label="Número" value={numero} onChange={setNumero} />
        <Input label="Complemento" value={complemento} onChange={setComplemento} />
        <Input label="Bairro" value={bairro} onChange={setBairro} />
        <Input label="Cidade" value={cidade} onChange={setCidade} />
        <Input label="UF" value={uf} onChange={setUf} />
        <Select
          label="Tipo"
          value={tipo}
          onChange={setTipo}
          options={["Apartamento", "Casa", "Sala comercial", "Loja", "Terreno"].map((t) => ({
            value: t,
            label: t,
          }))}
        />
        <Input label="Área" value={area} onChange={setArea} />
      </div>
      <Button type="submit" variant="primary">
        {submitLabel}
      </Button>
    </form>
  );
}
