import styled from "styled-components";

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

export const WizStepCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.card}px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.base};
  padding: 30px;

  @media (max-width: 640px) {
    padding: 18px;
  }
`;

export const WizStepCardHeader = styled.div`
  margin-bottom: 22px;
`;

export const WizStepCardTitle = styled.h2`
  font-family: ${({ theme }) => theme.typography.family};
  font-size: 27px;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: ${({ theme }) => theme.colors.ink};
  margin: 0;
`;

export const WizStepCardSubtitle = styled.p`
  font-size: 14.5px;
  color: ${({ theme }) => theme.colors.inkSoft};
  margin: 4px 0 0;
`;

export const SuccessContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const SuccessTitle = styled.h2`
  font-family: ${({ theme }) => theme.typography.family};
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.4px;
  color: ${({ theme }) => theme.colors.ink};
  margin: 18px 0 0;
`;

export const SuccessBody = styled.p`
  font-size: 14.5px;
  color: ${({ theme }) => theme.colors.inkSoft};
  margin: 6px 0 0;
`;
