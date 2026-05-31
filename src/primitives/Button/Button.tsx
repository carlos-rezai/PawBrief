import type { ButtonHTMLAttributes } from "react";
import { StyledButton } from "./Button.styles";

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
  kind = "secondary",
  size = "md",
  iconOnly = false,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <StyledButton
      type={type}
      $kind={kind}
      $size={size}
      $iconOnly={iconOnly}
      disabled={disabled || kind === "disabled"}
      {...props}
    >
      {children}
    </StyledButton>
  );
}
