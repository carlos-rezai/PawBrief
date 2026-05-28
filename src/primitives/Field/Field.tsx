import type { ReactNode } from "react";

interface FieldProps {
  label: string;
  children: ReactNode;
}

export default function Field({ label, children }: FieldProps) {
  return (
    <label>
      {label}
      {children}
    </label>
  );
}
