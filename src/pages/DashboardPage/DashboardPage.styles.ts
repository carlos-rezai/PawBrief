import styled from "styled-components";
import { theme as defaultTheme } from "../../tokens";

export const DashContent = styled.main`
  max-width: 1080px;
  margin: 0 auto;
  padding: 34px 28px 120px;

  @media (max-width: 640px) {
    padding: 24px 16px 80px;
  }
`;

export const DashHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
`;

export const DashHeaderLeft = styled.div``;

export const DashHeaderTitle = styled.h1`
  font-size: 33px;
  font-weight: 700;
  letter-spacing: -0.7px;
  color: ${({ theme }) => theme.colors.ink};
  margin: 0;
`;

export const DashHeaderSubtitle = styled.p`
  font-size: 14.5px;
  color: ${({ theme }) => theme.colors.inkSoft};
  margin: 5px 0 0;
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const EmptyStateWrapper = styled.div`
  text-align: center;
  padding: 80px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
`;

export const EmptyStateTitle = styled.h2`
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.4px;
  color: ${({ theme }) => theme.colors.ink};
  margin: 0;
`;

export const EmptyStateDesc = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.inkSoft};
  max-width: 380px;
  line-height: 1.5;
  margin: 0;
`;

export const MergeBar = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.input}px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
`;

export const MergeBarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const MergeCount = styled.span`
  font-size: 17px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.ink};
`;

export const MergeHint = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
`;

DashContent.defaultProps = { theme: defaultTheme };
DashHeader.defaultProps = { theme: defaultTheme };
DashHeaderTitle.defaultProps = { theme: defaultTheme };
DashHeaderSubtitle.defaultProps = { theme: defaultTheme };
EmptyStateTitle.defaultProps = { theme: defaultTheme };
EmptyStateDesc.defaultProps = { theme: defaultTheme };
MergeBar.defaultProps = { theme: defaultTheme };
MergeBarLeft.defaultProps = { theme: defaultTheme };
MergeCount.defaultProps = { theme: defaultTheme };
MergeHint.defaultProps = { theme: defaultTheme };
