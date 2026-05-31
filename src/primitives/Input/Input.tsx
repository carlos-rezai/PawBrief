import type { InputHTMLAttributes } from "react";
import { StyledInput } from "./Input.styles";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export default function Input({ hasError, ...props }: InputProps) {
  return (
    <StyledInput
      $hasError={hasError}
      aria-invalid={hasError ? true : undefined}
      {...props}
    />
  );
}
