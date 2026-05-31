import styled from "styled-components";
import { theme as defaultTheme } from "../../tokens";

export const ChartOuter = styled.div<{ $width: number; $height: number }>`
  position: relative;
  flex: 0 0 auto;
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => $height}px;
`;

export const ChartInner = styled.div<{ $left: number; $size: number }>`
  position: absolute;
  top: 0;
  left: ${({ $left }) => $left}px;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
`;

const ClockLabel = styled.span`
  position: absolute;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.muted};
  letter-spacing: 0.3px;
  white-space: nowrap;
  font-size: 10px;
  line-height: 1;
`;

export const ClockLabelTop = styled(ClockLabel)`
  top: 0;
  left: 0;
  right: 0;
  text-align: center;
`;

export const ClockLabelBottom = styled(ClockLabel)`
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
`;

export const ClockLabelRight = styled(ClockLabel)`
  right: 0;
  top: 50%;
  transform: translateY(-50%);
`;

export const ClockLabelLeft = styled(ClockLabel)`
  left: 0;
  top: 50%;
  transform: translateY(-50%);
`;

export const DayCentreContainer = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

export const DayLabel = styled.span`
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 11px;
`;

ClockLabel.defaultProps = { theme: defaultTheme };
ClockLabelTop.defaultProps = { theme: defaultTheme };
ClockLabelBottom.defaultProps = { theme: defaultTheme };
ClockLabelRight.defaultProps = { theme: defaultTheme };
ClockLabelLeft.defaultProps = { theme: defaultTheme };
DayLabel.defaultProps = { theme: defaultTheme };
