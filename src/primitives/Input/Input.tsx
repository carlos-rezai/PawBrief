import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export default function Input({ hasError, ...props }: InputProps) {
  return <input {...props} aria-invalid={hasError ? true : undefined} />;
}
