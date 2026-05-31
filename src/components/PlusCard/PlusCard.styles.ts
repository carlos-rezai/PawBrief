import styled from "styled-components";
import { theme as defaultTheme } from "../../tokens";

export const PlusCardRoot = styled.button`
  background: transparent;
  border: 1.5px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.card}px;
  min-height: 270px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.16s;
  font-family: ${({ theme }) => theme.typography.family};
  color: ${({ theme }) => theme.colors.inkSoft};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceAlt};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const PlusCircle = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primarySoft};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PlusCardLabel = styled.span`
  font-family: ${({ theme }) => theme.typography.family};
  font-weight: 700;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.ink};
`;

export const PlusCardHint = styled.span`
  font-size: 12.5px;
  color: ${({ theme }) => theme.colors.muted};
`;

PlusCardRoot.defaultProps = { theme: defaultTheme };
PlusCircle.defaultProps = { theme: defaultTheme };
PlusCardLabel.defaultProps = { theme: defaultTheme };
PlusCardHint.defaultProps = { theme: defaultTheme };
