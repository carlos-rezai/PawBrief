import styled from "styled-components";
import { theme as defaultTheme } from "../../tokens";

export const DashNavbar = styled.nav`
  position: sticky;
  top: 0;
  z-index: 10;
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  height: 64px;
`;

export const DashNavbarInner = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 28px;
  height: 100%;
  display: flex;
  align-items: center;

  @media (max-width: 640px) {
    padding: 0 16px;
  }
`;

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

DashNavbar.defaultProps = { theme: defaultTheme };
DashNavbarInner.defaultProps = { theme: defaultTheme };
DashContent.defaultProps = { theme: defaultTheme };
DashHeader.defaultProps = { theme: defaultTheme };
DashHeaderTitle.defaultProps = { theme: defaultTheme };
DashHeaderSubtitle.defaultProps = { theme: defaultTheme };
EmptyStateTitle.defaultProps = { theme: defaultTheme };
EmptyStateDesc.defaultProps = { theme: defaultTheme };
