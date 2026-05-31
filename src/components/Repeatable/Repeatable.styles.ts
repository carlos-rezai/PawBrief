import styled from "styled-components";
import { theme as defaultTheme } from "../../tokens";

export const RepeatableRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const EntryCard = styled.div`
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.input}px;
  padding: 14px;
`;

export const EntryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 11px;
`;

export const EntryLabel = styled.span`
  font-family: ${({ theme }) => theme.typography.family};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.muted};
`;

export const RemoveButton = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.muted};
  transition:
    border-color 0.14s,
    background 0.14s,
    color 0.14s;
  flex: 0 0 auto;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primarySoft};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

EntryCard.defaultProps = { theme: defaultTheme };
EntryLabel.defaultProps = { theme: defaultTheme };
RemoveButton.defaultProps = { theme: defaultTheme };
