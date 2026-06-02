import styled from "styled-components";
import { theme as defaultTheme } from "../../../tokens";

export const ThreeColGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const TwoColGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const ServingHeaders = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 36px;
  gap: 8px;
  padding: 0 2px 4px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.muted};
`;

export const ServingRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 36px;
  gap: 8px;
  align-items: center;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.input}px;
  padding: 8px 10px;
`;

ServingHeaders.defaultProps = { theme: defaultTheme };
ServingRow.defaultProps = { theme: defaultTheme };
