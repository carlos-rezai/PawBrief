import styled from "styled-components";
import { theme as defaultTheme } from "../../tokens";

export const SwatchWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
`;

export const SwatchButton = styled.button<{
  $color: string;
  $size?: number;
  $active?: boolean;
}>`
  width: ${({ $size }) => $size ?? 14}px;
  height: ${({ $size }) => $size ?? 14}px;
  border-radius: 4px;
  background: ${({ $color }) => $color};
  border: 2px solid
    ${({ $active, theme }) => ($active ? theme.colors.ink : "transparent")};
  cursor: pointer;
  padding: 0;
  display: block;
  flex-shrink: 0;
  outline: none;
  transition: transform 0.1s;

  &:hover {
    transform: scale(1.12);
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.ring};
  }
`;

export const Popover = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.input}px;
  box-shadow: ${({ theme }) => theme.shadows.base};
  padding: 6px;
  display: grid;
  grid-template-columns: repeat(2, 20px);
  gap: 5px;
  z-index: 100;
`;

SwatchButton.defaultProps = { theme: defaultTheme };
Popover.defaultProps = { theme: defaultTheme };
