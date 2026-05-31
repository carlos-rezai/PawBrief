import styled from "styled-components";
import { theme as defaultTheme } from "../../tokens";

type ButtonKind = "primary" | "secondary" | "ghost" | "disabled" | "dashed";
type ButtonSize = "sm" | "md" | "lg";

export interface StyledButtonProps {
  $kind: ButtonKind;
  $size: ButtonSize;
  $iconOnly: boolean;
}

export const StyledButton = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  font-family: ${({ theme }) => theme.typography.family};
  font-weight: 700;
  letter-spacing: 0.1px;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.radii.button}px;
  transition:
    background 0.15s,
    border-color 0.15s,
    box-shadow 0.15s,
    filter 0.15s;

  /* size */
  ${({ $size, $iconOnly, theme }) => {
    const s = theme.typography.buttonSize[$size];
    return `
      height: ${s.height}px;
      font-size: ${s.fontSize}px;
      ${$iconOnly ? `width: ${s.height}px; padding: 0;` : `padding: 0 ${s.padX}px;`}
    `;
  }}

  /* kind */
  ${({ $kind, theme }) => {
    const { colors, shadows } = theme;
    if ($kind === "primary")
      return `
        background: ${colors.primary};
        color: ${colors.primaryInk};
        border: 1px solid transparent;
        box-shadow: ${shadows.soft};
        &:hover:not(:disabled) { filter: brightness(0.92); }
      `;
    if ($kind === "secondary")
      return `
        background: ${colors.surface};
        color: ${colors.ink};
        border: 1px solid ${colors.border};
        &:hover:not(:disabled) { border-color: ${colors.inkSoft}; }
      `;
    if ($kind === "ghost")
      return `
        background: transparent;
        color: ${colors.primary};
        border: 1px solid transparent;
        &:hover:not(:disabled) { background: ${colors.primarySoft}; }
      `;
    if ($kind === "dashed")
      return `
        background: transparent;
        color: ${colors.primary};
        border: 1.5px dashed ${colors.border};
        width: 100%;
        justify-content: center;
        &:hover:not(:disabled) {
          border-color: ${colors.primary};
          background: ${colors.surface};
        }
      `;
    /* disabled kind */
    return `
      background: ${colors.surfaceAlt};
      color: ${colors.muted};
      border: 1px solid ${colors.border};
    `;
  }}

  /* disabled HTML state (applies regardless of kind) */
  &:disabled {
    background: ${({ theme }) => theme.colors.surfaceAlt};
    color: ${({ theme }) => theme.colors.muted};
    border: 1px solid ${({ theme }) => theme.colors.border};
    box-shadow: none;
    cursor: not-allowed;
    filter: none;
  }
`;

StyledButton.defaultProps = { theme: defaultTheme };
