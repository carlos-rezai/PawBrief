import styled, { keyframes } from "styled-components";
import { theme as defaultTheme } from "../../tokens";

const slideIn = keyframes`
  from { transform: translateY(8px); opacity: 0; }
  to   { transform: translateY(0);   opacity: 1; }
`;

export const ToastContainer = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 200;
`;

export const ToastItem = styled.div`
  background: ${({ theme }) => theme.colors.ink};
  color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.input}px;
  padding: 12px 18px;
  font-size: 14px;
  font-weight: 600;
  font-family: ${({ theme }) => theme.typography.family};
  box-shadow: ${({ theme }) => theme.shadows.base};
  animation: ${slideIn} 0.2s ease;
  max-width: 320px;
`;

ToastItem.defaultProps = { theme: defaultTheme };
