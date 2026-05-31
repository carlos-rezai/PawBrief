import styled from "styled-components";

export const ChartOuter = styled.div`
  position: relative;
  flex: 0 0 auto;
`;

export const ChartInner = styled.div`
  position: absolute;
  top: 0;
`;

export const ClockLabel = styled.span`
  position: absolute;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.muted};
  letter-spacing: 0.3px;
  white-space: nowrap;
  font-size: 10px;
  line-height: 1;
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
