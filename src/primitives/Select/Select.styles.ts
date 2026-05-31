import styled from "styled-components";
import { theme as defaultTheme } from "../../tokens";

interface StyledSelectProps {
  $hasError?: boolean;
}

export const SelectWrapper = styled.div`
  position: relative;
  display: block;
`;

export const StyledSelect = styled.select<StyledSelectProps>`
  width: 100%;
  box-sizing: border-box;
  font-family: ${({ theme }) => theme.typography.family};
  font-size: 14.5px;
  color: ${({ theme }) => theme.colors.ink};
  background: ${({ theme }) => theme.colors.surface};
  border: 1.5px solid
    ${({ theme, $hasError }) =>
      $hasError ? theme.colors.accent : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.input}px;
  padding: 10px 32px 10px 13px;
  line-height: 1.35;
  outline: none;
  appearance: none;
  cursor: pointer;
  transition:
    border-color 0.14s,
    box-shadow 0.14s;

  &:focus {
    border-color: ${({ theme, $hasError }) =>
      $hasError ? theme.colors.accent : theme.colors.primary};
    box-shadow: 0 0 0 3px
      ${({ theme, $hasError }) =>
        $hasError ? theme.colors.accentSoft : theme.colors.ring};
  }
`;

export const ChevronIcon = styled.svg`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
`;

StyledSelect.defaultProps = { theme: defaultTheme };
