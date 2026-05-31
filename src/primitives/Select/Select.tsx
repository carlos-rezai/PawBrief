import type { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

export default function Select({ children, hasError, ...props }: SelectProps) {
  return (
    <div>
      <select {...props} aria-invalid={hasError ? true : undefined}>
        {children}
      </select>
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path d="M4 6l4 4 4-4" stroke="currentColor" fill="none" />
      </svg>
    </div>
  );
}
