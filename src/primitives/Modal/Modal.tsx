import type { ReactNode } from "react";
import styled from "styled-components";

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const Box = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.card}px;
  padding: ${({ theme }) => theme.spacing[6]}px;
  min-width: 320px;
  max-width: 90vw;
`;

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ onClose, children }: ModalProps) {
  return (
    <Backdrop onClick={onClose}>
      <Box role="dialog" onClick={(e) => e.stopPropagation()}>
        {children}
      </Box>
    </Backdrop>
  );
}
