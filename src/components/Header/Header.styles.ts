import styled from "styled-components";
import { theme as defaultTheme } from "../../tokens";

export const HeaderNav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 10;
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  height: 64px;
`;

export const HeaderInner = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 28px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 640px) {
    padding: 0 16px;
  }
`;

HeaderNav.defaultProps = { theme: defaultTheme };
HeaderInner.defaultProps = { theme: defaultTheme };
