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
  color: ${({ theme }) => theme.colors.muted};
  cursor: pointer;
  transition: all 0.15s;
  overflow: hidden;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.primary};
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

export const PhotoPreview = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  z-index: 0;
`;

export const PhotoChangeOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: rgba(0, 0, 0, 0.42);
  color: white;
  font-size: 12.5px;
  font-weight: 700;
  opacity: 0;
  transition: opacity 0.15s;
  pointer-events: none;

  ${PhotoCircle}:hover & {
    opacity: 1;
  }
`;

export const PhotoFileInput = styled.input`
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
  z-index: 2;
`;

export const FullInput = styled.input`
  width: 100%;
`;

PhotoCircle.defaultProps = { theme: defaultTheme };
PhotoCircleText.defaultProps = { theme: defaultTheme };
