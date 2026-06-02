import styled from "styled-components";
import { theme as defaultTheme } from "../../tokens";

interface DropzoneProps {
  $round: boolean;
  $height: number;
}

export const Dropzone = styled.label<DropzoneProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  width: ${({ $round, $height }) => ($round ? `${$height}px` : "100%")};
  height: ${({ $height }) => $height}px;
  border-radius: ${({ $round, theme }) =>
    $round ? "50%" : `${theme.radii.input}px`};
  border: 1.5px dashed ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.inkSoft};
  cursor: pointer;
  transition: all 0.14s;
  overflow: hidden;
  box-sizing: border-box;
  padding: 10px;
  text-align: center;

  ${({ $round }) => $round && "margin: 0 auto;"}

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const DropzoneText = styled.span`
  font-size: 12.5px;
  font-weight: 700;
  color: inherit;
  pointer-events: none;
`;

export const DropzoneHint = styled.span`
  font-family: ui-monospace, monospace;
  font-size: 10.5px;
  color: ${({ theme }) => theme.colors.muted};
  pointer-events: none;
`;

export const PreviewImg = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
`;

export const ChangeOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
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

  ${Dropzone}:hover & {
    opacity: 1;
  }
`;

export const HiddenInput = styled.input`
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
  z-index: 2;
`;

export const FieldLabel = styled.div`
  font-size: 12.5px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.inkSoft};
  margin-bottom: 8px;
`;

export const ErrorText = styled.p`
  margin: 5px 0 0;
  font-size: 11.5px;
  color: ${({ theme }) => theme.colors.accent};
`;

Dropzone.defaultProps = { theme: defaultTheme };
DropzoneHint.defaultProps = { theme: defaultTheme };
FieldLabel.defaultProps = { theme: defaultTheme };
ErrorText.defaultProps = { theme: defaultTheme };
