import styled from "styled-components";
import { theme as defaultTheme } from "../../tokens";

export const EntryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]}px;
`;

export const EntryCard = styled.div`
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.input}px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const EntryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const EntryLabel = styled.span`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.muted};
`;

export const RemoveButton = styled.button`
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.muted};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.14s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primarySoft};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const AddEntryButton = styled.button`
  margin-top: ${({ theme }) => theme.spacing[3]}px;
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  background: transparent;
  border: 1.5px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.input}px;
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.typography.family};
  font-size: 13.5px;
  font-weight: 700;
  padding: 9px 15px;
  cursor: pointer;
  transition: all 0.14s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.surface};
  }
`;

EntryList.defaultProps = { theme: defaultTheme };
EntryCard.defaultProps = { theme: defaultTheme };
EntryHeader.defaultProps = { theme: defaultTheme };
EntryLabel.defaultProps = { theme: defaultTheme };
RemoveButton.defaultProps = { theme: defaultTheme };
AddEntryButton.defaultProps = { theme: defaultTheme };
