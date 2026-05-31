import type { ReactNode } from "react";

interface FieldProps {
  label: string;
  children: ReactNode;
  optional?: boolean;
  hint?: string;
  error?: string;
}

export default function Field({
  label,
  children,
  optional,
  hint,
  error,
}: FieldProps) {
  return (
    <label>
      {label}
      {optional && <span>(optional)</span>}
      {children}
      {hint && <span>{hint}</span>}
      {error && <span role="alert">{error}</span>}
    </label>
  );
}
