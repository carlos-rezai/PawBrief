import styled from "styled-components";
import { theme as defaultTheme } from "../../tokens";

export const StepFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const StepFooterSpacer = styled.div`
  flex: 1;
`;

StepFooter.defaultProps = { theme: defaultTheme };
