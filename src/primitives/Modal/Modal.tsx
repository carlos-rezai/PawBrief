import type { ReactNode } from "react";
import { Backdrop, ModalBox } from "./Modal.styles";

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ onClose, children }: ModalProps) {
  return (
    <Backdrop onClick={onClose}>
      <ModalBox role="dialog" onClick={(e) => e.stopPropagation()}>
        {children}
      </ModalBox>
    </Backdrop>
  );
}
