import styled from "styled-components";
import { theme as defaultTheme } from "../../../tokens";

export const BasicsBody = styled.div`
  display: flex;
  gap: 22px;
  align-items: flex-start;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const PhotoCol = styled.div`
  flex: 0 0 auto;
  width: 124px;
`;

export const PhotoCircle = styled.label`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 124px;
  height: 124px;
  border-radius: 50%;
  border: 1.5px dashed ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  cursor: pointer;
  transition: all 0.15s;
  overflow: hidden;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.surface};
  }

  &:hover .photo-circle-icon {
    stroke: ${({ theme }) => theme.colors.primary};
  }

  &:hover .photo-circle-text {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const PhotoCircleText = styled.span`
  font-size: 12.5px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.inkSoft};
  pointer-events: none;
`;

export const FieldsCol = styled.div`
  flex: 1;
  min-width: 240px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const AgeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

PhotoCircle.defaultProps = { theme: defaultTheme };
PhotoCircleText.defaultProps = { theme: defaultTheme };
