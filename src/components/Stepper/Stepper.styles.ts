import styled from "styled-components";
import { theme as defaultTheme } from "../../tokens";

export const StepperNav = styled.nav`
  display: flex;
  align-items: flex-start;
  width: 100%;
`;

export const StepButton = styled.button<{ $done: boolean; $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: 0 0 auto;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-family: ${({ theme }) => theme.typography.family};
`;

export const StepCircle = styled.span<{ $done: boolean; $active: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12.5px;
  font-weight: 700;
  box-sizing: border-box;
  transition: all 0.15s;

  ${({ $done, $active, theme }) => {
    if ($done)
      return `
        background: ${theme.colors.primary};
        color: ${theme.colors.primaryInk};
        border: 1.5px solid ${theme.colors.primary};
      `;
    if ($active)
      return `
        background: ${theme.colors.surface};
        color: ${theme.colors.primary};
        border: 2px solid ${theme.colors.primary};
        box-shadow: 0 0 0 3px ${theme.colors.ring};
      `;
    return `
      background: ${theme.colors.surfaceAlt};
      color: ${theme.colors.muted};
      border: 1.5px solid ${theme.colors.border};
    `;
  }}
`;

export const StepLabel = styled.span<{ $active: boolean }>`
  font-size: 10.5px;
  font-weight: ${({ $active }) => ($active ? 700 : 600)};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.ink : theme.colors.muted};

  @media (max-width: 640px) {
    display: none;
  }
`;

export const StepConnector = styled.div<{ $done: boolean }>`
  flex: 1;
  height: 2px;
  background: ${({ $done, theme }) =>
    $done ? theme.colors.primary : theme.colors.border};
  align-self: flex-start;
  margin-top: 14px;
  border-radius: 2px;
`;

StepButton.defaultProps = { theme: defaultTheme };
StepCircle.defaultProps = { theme: defaultTheme };
StepLabel.defaultProps = { theme: defaultTheme };
StepConnector.defaultProps = { theme: defaultTheme };
