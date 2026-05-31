import type { ButtonHTMLAttributes } from "react";

type ButtonKind = "primary" | "secondary" | "ghost" | "disabled" | "dashed";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  kind?: ButtonKind;
  size?: ButtonSize;
  iconOnly?: boolean;
}

export default function Button({
  children,
  type = "button",
  kind,
  size: _size,
  iconOnly: _iconOnly,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button type={type} disabled={disabled || kind === "disabled"} {...props}>
      {children}
    </button>
  );
}
