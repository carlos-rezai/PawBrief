import type { SelectHTMLAttributes } from "react";
import { ChevronIcon, SelectWrapper, StyledSelect } from "./Select.styles";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

export default function Select({ children, hasError, ...props }: SelectProps) {
  return (
    <SelectWrapper>
      <StyledSelect
        $hasError={hasError}
        aria-invalid={hasError ? true : undefined}
        {...props}
      >
        {children}
      </StyledSelect>
      <ChevronIcon
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M2 4l4 4 4-4"
          stroke="#6F6155"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </ChevronIcon>
    </SelectWrapper>
  );
}
