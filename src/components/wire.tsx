import type { ReactNode } from "react";
import { STATUS_LABEL, type ContractStatus } from "@/data/mock";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
      <div>
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}

export function Panel({
  title,
  aside,
  children,
}: {
  title?: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="border border-border bg-card">
      {title ? (
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {title}
          </h2>
          {aside}
        </div>
      ) : null}
      <div className="p-4">{children}</div>
    </section>
  );
}

export function Button({
  children,
  variant = "secondary",
  type = "button",
  disabled,
  onClick,
  title,
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  title?: string;
}) {
  const base =
    "inline-flex items-center justify-center border px-3 py-1.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40";
  const variants = {
    primary: "border-primary bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "border-border bg-background text-foreground hover:bg-accent",
    danger: "border-destructive bg-background text-destructive hover:bg-destructive/10",
  } as const;
  return (
    <button
      type={type}
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant]}`}
    >
      {children}
    </button>
  );
}

export function StatusBadge({ status }: { status: ContractStatus }) {
  const tone =
    status === "ATIVO" || status === "ASSINADO"
      ? "border-foreground text-foreground"
      : status === "CANCELADO" || status === "RECUSADO"
        ? "border-destructive text-destructive"
        : "border-border text-muted-foreground";
  return (
    <span
      className={`inline-flex items-center border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${tone}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center border border-border px-2 py-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">
      {children}
    </span>
  );
}

export function Field({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm text-foreground">{value ?? "—"}</dd>
    </div>
  );
}

export function FieldGrid({ children, cols = 3 }: { children: ReactNode; cols?: 2 | 3 | 4 }) {
  const map = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-4" } as const;
  return <dl className={`grid grid-cols-1 gap-4 ${map[cols]}`}>{children}</dl>;
}

export function Input({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  hint,
}: {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  type?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className="mt-1 w-full border border-input bg-background px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-ring"
      />
      {hint ? <span className="mt-1 block text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-input bg-background px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-ring"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="border border-dashed border-border px-6 py-10 text-center">
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description ? (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

export function LoadingState({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-2" aria-busy="true" aria-label="Carregando">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-9 w-full border border-dashed border-border bg-muted" />
      ))}
    </div>
  );
}

export function Callout({
  tone = "info",
  children,
}: {
  tone?: "info" | "success" | "error";
  children: ReactNode;
}) {
  const tones = {
    info: "border-border bg-muted text-foreground",
    success: "border-foreground bg-background text-foreground",
    error: "border-destructive bg-background text-destructive",
  } as const;
  return <div className={`border px-3 py-2 text-sm ${tones[tone]}`}>{children}</div>;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  destructive,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4"
    >
      <div className="w-full max-w-md border border-border bg-card p-4">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button onClick={onCancel}>Cancelar</Button>
          <Button variant={destructive ? "danger" : "primary"} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto border border-border">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-muted">
            {head.map((h) => (
              <th
                key={h}
                className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Td({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <td className={`border-b border-border px-3 py-2 align-middle ${className}`}>{children}</td>;
}

export function Timeline({
  items,
}: {
  items: { data: string; titulo: string; autor: string; detalhe?: string }[];
}) {
  return (
    <ol className="relative border-l border-border pl-5">
      {items.map((item, i) => (
        <li key={i} className="relative pb-5 last:pb-0">
          <span className="absolute -left-[23px] top-1.5 h-2 w-2 border border-foreground bg-background" />
          <p className="text-sm font-medium text-foreground">{item.titulo}</p>
          <p className="text-xs text-muted-foreground">
            {item.data} · {item.autor}
          </p>
          {item.detalhe ? (
            <p className="mt-1 text-xs text-muted-foreground">{item.detalhe}</p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

export function Stepper({
  steps,
  current,
  onSelect,
}: {
  steps: string[];
  current: number;
  onSelect?: (i: number) => void;
}) {
  return (
    <ol className="flex flex-wrap gap-2">
      {steps.map((s, i) => {
        const state = i === current ? "atual" : i < current ? "concluída" : "pendente";
        return (
          <li key={s}>
            <button
              type="button"
              onClick={() => onSelect?.(i)}
              className={`flex items-center gap-2 border px-3 py-1.5 text-sm ${
                i === current
                  ? "border-foreground bg-muted font-medium text-foreground"
                  : "border-border text-muted-foreground hover:bg-accent"
              }`}
              aria-current={i === current ? "step" : undefined}
            >
              <span className="border border-current px-1.5 text-[11px]">{i + 1}</span>
              {s}
              <span className="sr-only"> — {state}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
