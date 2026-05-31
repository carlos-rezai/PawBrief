import styled from "styled-components";
import { theme as defaultTheme } from "../../tokens";

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

export const ModalBox = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.card}px;
  padding: ${({ theme }) => theme.spacing[8]}px;
  min-width: 320px;
  max-width: 480px;
  width: 90vw;
  box-shadow: ${({ theme }) => theme.shadows.base};
`;

Backdrop.defaultProps = { theme: defaultTheme };
ModalBox.defaultProps = { theme: defaultTheme };
