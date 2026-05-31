import styled from "styled-components";
import { theme as defaultTheme } from "../../tokens";

export const ChipsRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const InputRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: stretch;
`;

export const ChipsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: ${({ theme }) => theme.colors.primarySoft};
  color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.chip}px;
  padding: 6px 8px 6px 12px;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
`;

export const ChipRemove = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};
  line-height: 1;
  opacity: 0.7;
  transition: opacity 0.14s;

  &:hover {
    opacity: 1;
  }
`;

Chip.defaultProps = { theme: defaultTheme };
ChipRemove.defaultProps = { theme: defaultTheme };
