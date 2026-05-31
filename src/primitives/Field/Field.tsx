import type { ReactNode } from "react";
import {
  FieldRoot,
  HelperText,
  LabelRow,
  LabelText,
  OptionalBadge,
} from "./Field.styles";

interface FieldProps {
  label: string;
  children: ReactNode;
  optional?: boolean;
  hint?: string;
  error?: string;
}

export default function Field({
  label,
  children,
  optional,
  hint,
  error,
}: FieldProps) {
  return (
    <FieldRoot>
      <LabelRow>
        <LabelText>{label}</LabelText>
        {optional && <OptionalBadge>Optional</OptionalBadge>}
      </LabelRow>
      {children}
      {error && (
        <HelperText $error role="alert">
          {error}
        </HelperText>
      )}
      {!error && hint && <HelperText>{hint}</HelperText>}
    </FieldRoot>
  );
}
