import styled from "styled-components";
import { theme as defaultTheme } from "../../tokens";

export const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ModalTitle = styled.h2`
  font-family: ${({ theme }) => theme.typography.family};
  font-size: ${({ theme }) => theme.typography.scale.uiHeading.size}px;
  font-weight: ${({ theme }) => theme.typography.scale.uiHeading.weight};
  color: ${({ theme }) => theme.colors.ink};
  margin: 0;
`;

export const ModalActions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding-top: 4px;
`;

ModalTitle.defaultProps = { theme: defaultTheme };
