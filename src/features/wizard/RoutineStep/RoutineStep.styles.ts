import styled from "styled-components";
import { theme as defaultTheme } from "../../../tokens";

export const ChartBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 22px;
`;

export const ChartCaption = styled.p`
  font-size: 12.5px;
  color: ${({ theme }) => theme.colors.muted};
  text-align: center;
  max-width: 360px;
  margin: 0;
`;

export const SlotHeaders = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 10px 6px;
  font-family: ${({ theme }) => theme.typography.family};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.muted};

  @media (max-width: 640px) {
    display: none;
  }
`;

export const SlotRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  row-gap: 8px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.input}px;
  padding: 8px 10px;
`;

export const SlotLabelInput = styled.input`
  flex: 1 1 140px;
  min-width: 0;
  background: transparent;
  border: none;
  outline: none;
  font-family: ${({ theme }) => theme.typography.family};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ink};

  &::placeholder {
    color: ${({ theme }) => theme.colors.muted};
    font-weight: 400;
  }
`;

export const SlotTimeInput = styled.input`
  width: 104px;
  flex-shrink: 0;
  box-sizing: border-box;
  font-family: ${({ theme }) => theme.typography.family};
  font-size: 13.5px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ink};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.input}px;
  padding: 6px 8px;
  outline: none;
  transition:
    border-color 0.14s,
    box-shadow 0.14s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.ring};
  }
`;

export const SlotHoursWrapper = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
`;

export const SlotHoursInput = styled.input`
  width: 52px;
  text-align: center;
  box-sizing: border-box;
  font-family: ${({ theme }) => theme.typography.family};
  font-size: 13.5px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.ink};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.input}px;
  padding: 6px 4px;
  outline: none;
  transition:
    border-color 0.14s,
    box-shadow 0.14s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.ring};
  }
`;

export const SlotHoursSuffix = styled.span`
  font-size: 12.5px;
  color: ${({ theme }) => theme.colors.muted};
`;

export const AddSlotButton = styled.button`
  width: 100%;
  margin-top: 10px;
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

export const TotalLine = styled.p`
  font-size: 12.5px;
  color: ${({ theme }) => theme.colors.muted};
  text-align: right;
  margin: 8px 0 0;
`;

ChartCaption.defaultProps = { theme: defaultTheme };
SlotHeaders.defaultProps = { theme: defaultTheme };
SlotRow.defaultProps = { theme: defaultTheme };
SlotLabelInput.defaultProps = { theme: defaultTheme };
SlotTimeInput.defaultProps = { theme: defaultTheme };
SlotHoursInput.defaultProps = { theme: defaultTheme };
SlotHoursSuffix.defaultProps = { theme: defaultTheme };
AddSlotButton.defaultProps = { theme: defaultTheme };
TotalLine.defaultProps = { theme: defaultTheme };
