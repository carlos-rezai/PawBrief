import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function Textarea(props: TextareaProps) {
  return <textarea {...props} />;
}
