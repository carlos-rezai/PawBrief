import styled from "styled-components";
import { theme as defaultTheme } from "../../tokens";

interface StyledTextareaProps {
  $hasError?: boolean;
}

export const StyledTextarea = styled.textarea<StyledTextareaProps>`
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
  padding: 10px 13px;
  line-height: 1.35;
  outline: none;
  resize: vertical;
  min-height: 80px;
  transition:
    border-color 0.14s,
    box-shadow 0.14s;

  &::placeholder {
    color: ${({ theme }) => theme.colors.muted};
  }

  &:focus {
    border-color: ${({ theme, $hasError }) =>
      $hasError ? theme.colors.accent : theme.colors.primary};
    box-shadow: 0 0 0 3px
      ${({ theme, $hasError }) =>
        $hasError ? theme.colors.accentSoft : theme.colors.ring};
  }
`;

StyledTextarea.defaultProps = { theme: defaultTheme };
