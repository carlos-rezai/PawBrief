import type { TextareaHTMLAttributes } from "react";
import { StyledTextarea } from "./Textarea.styles";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export default function Textarea({ hasError, ...props }: TextareaProps) {
  return (
    <StyledTextarea
      $hasError={hasError}
      aria-invalid={hasError ? true : undefined}
      {...props}
    />
  );
}
