export type CepAddress = {
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
};

const CEP_MAP: Record<string, CepAddress> = {
  "01310100": { logradouro: "Av. Paulista", bairro: "Bela Vista", cidade: "São Paulo", uf: "SP" },
  "04543011": {
    logradouro: "Rua Olimpíadas",
    bairro: "Vila Olímpia",
    cidade: "São Paulo",
    uf: "SP",
  },
  "05413020": {
    logradouro: "Rua Harmonia",
    bairro: "Vila Madalena",
    cidade: "São Paulo",
    uf: "SP",
  },
  "09015000": {
    logradouro: "Rua Sete de Setembro",
    bairro: "Centro",
    cidade: "Santo André",
    uf: "SP",
  },
  "01310200": {
    logradouro: "Alameda Santos",
    bairro: "Cerqueira César",
    cidade: "São Paulo",
    uf: "SP",
  },
  "22041080": {
    logradouro: "Av. Atlântica",
    bairro: "Copacabana",
    cidade: "Rio de Janeiro",
    uf: "RJ",
  },
  "30130100": {
    logradouro: "Av. Afonso Pena",
    bairro: "Centro",
    cidade: "Belo Horizonte",
    uf: "MG",
  },
  "80010000": { logradouro: "Rua XV de Novembro", bairro: "Centro", cidade: "Curitiba", uf: "PR" },
};

export function normalizeCep(cep: string) {
  return cep.replace(/\D/g, "").slice(0, 8);
}

export function formatCep(cep: string) {
  const digits = normalizeCep(cep);
  if (digits.length !== 8) return cep;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export function lookupCep(cep: string): CepAddress | null {
  const digits = normalizeCep(cep);
  if (digits.length !== 8) return null;
  return CEP_MAP[digits] ?? null;
}
