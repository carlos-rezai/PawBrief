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
  gap: 10px;
  padding: 0 10px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: 4px;

  @media (max-width: 640px) {
    display: none;
  }
`;

export const SlotRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 8px 10px;
  margin-bottom: 6px;
`;

export const ColorDot = styled.span<{ $color: string }>`
  width: 14px;
  height: 14px;
  border-radius: 4px;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

export const SlotLabelInput = styled.input`
  flex: 1;
  min-width: 80px;
  background: transparent;
  border: none;
  outline: none;
  font-size: 14px;
  color: inherit;
`;

export const SlotTimeInput = styled.input`
  width: 104px;
`;

export const SlotHoursWrapper = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  width: 78px;
`;

export const SlotHoursInput = styled.input`
  width: 100%;
`;

export const SlotHoursSuffix = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
`;

export const AddSlotButton = styled.button`
  width: 100%;
  padding: 8px;
  border: 1.5px dashed ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.primary};
  margin-top: 6px;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.surfaceAlt};
  }
`;

export const TotalLine = styled.p`
  font-size: 12.5px;
  color: ${({ theme }) => theme.colors.muted};
  text-align: right;
  margin: 8px 0 0;
`;

SlotHeaders.defaultProps = { theme: defaultTheme };
SlotRow.defaultProps = { theme: defaultTheme };
SlotHoursSuffix.defaultProps = { theme: defaultTheme };
AddSlotButton.defaultProps = { theme: defaultTheme };
TotalLine.defaultProps = { theme: defaultTheme };
ChartCaption.defaultProps = { theme: defaultTheme };
