import type { InputHTMLAttributes } from "react";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export default function Checkbox(props: CheckboxProps) {
  return <input type="checkbox" {...props} />;
}
