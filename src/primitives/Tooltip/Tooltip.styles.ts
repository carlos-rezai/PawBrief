import styled from "styled-components";
import { theme as defaultTheme } from "../../tokens";

export const TooltipRoot = styled.span`
  position: relative;
  display: inline-flex;
`;

export const TooltipBubble = styled.span<{
  $visible: boolean;
  $side: "top" | "bottom";
}>`
  position: absolute;
  ${({ $side }) =>
    $side === "top" ? "bottom: calc(100% + 6px);" : "top: calc(100% + 6px);"}
  left: 50%;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.colors.ink};
  color: ${({ theme }) => theme.colors.surface};
  font-family: ${({ theme }) => theme.typography.family};
  font-size: 11.5px;
  font-weight: 600;
  white-space: nowrap;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.radii.chip}px;
  pointer-events: none;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.15s;
  z-index: 200;
`;

TooltipBubble.defaultProps = { theme: defaultTheme };
