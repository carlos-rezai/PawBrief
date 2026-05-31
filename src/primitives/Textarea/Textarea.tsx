import type { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export default function Textarea({ hasError, ...props }: TextareaProps) {
  return <textarea {...props} aria-invalid={hasError ? true : undefined} />;
}
