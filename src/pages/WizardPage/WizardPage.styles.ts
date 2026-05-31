import styled from "styled-components";

export const WizNavbar = styled.nav`
  position: sticky;
  top: 0;
  z-index: 10;
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  height: 60px;
`;

export const WizNavbarInner = styled.div`
  max-width: 760px;
  margin: 0 auto;
  padding: 0 24px;
  height: 100%;
  display: flex;
  align-items: center;
`;

export const WizMain = styled.main`
  max-width: 760px;
  margin: 0 auto;
  padding: 30px 24px 60px;

  @media (max-width: 640px) {
    padding: 20px 16px 48px;
  }
`;

export const WizStepEyebrow = styled.p`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.7px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.muted};
  text-align: center;
  margin: 26px 0 16px;
`;
