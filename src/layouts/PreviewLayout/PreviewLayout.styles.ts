import styled from "styled-components";
import { theme as defaultTheme } from "../../tokens";

export const PreviewContent = styled.main`
  max-width: 1080px;
  margin: 0 auto;
  padding: 34px 28px 60px;

  @media (max-width: 640px) {
    padding: 24px 16px 48px;
  }
`;

export const PreviewHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
`;

export const PreviewTitle = styled.h1`
  font-family: ${({ theme }) => theme.typography.family};
  font-size: 33px;
  font-weight: 700;
  letter-spacing: -0.7px;
  color: ${({ theme }) => theme.colors.ink};
  margin: 0;
`;

export const PreviewActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const PdfViewerContainer = styled.div`
  width: 100%;
  height: 80vh;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.card}px;
  overflow: hidden;
`;

PreviewTitle.defaultProps = { theme: defaultTheme };
PdfViewerContainer.defaultProps = { theme: defaultTheme };
