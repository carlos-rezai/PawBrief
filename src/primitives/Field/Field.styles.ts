import styled from "styled-components";
import { theme as defaultTheme } from "../../tokens";

export const FieldRoot = styled.label`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const LabelRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
`;

export const LabelText = styled.span`
  font-family: ${({ theme }) => theme.typography.family};
  font-size: 12.5px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.inkSoft};
`;

export const OptionalBadge = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.muted};
`;

export const HelperText = styled.div<{ $error?: boolean }>`
  font-size: 11.5px;
  color: ${({ theme, $error }) =>
    $error ? theme.colors.accent : theme.colors.muted};
  margin-top: 5px;
`;

LabelText.defaultProps = { theme: defaultTheme };
OptionalBadge.defaultProps = { theme: defaultTheme };
HelperText.defaultProps = { theme: defaultTheme };
