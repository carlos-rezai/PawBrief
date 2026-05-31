import type { ReactNode } from "react";
import Button from "../../primitives/Button/Button";
import Modal from "../../primitives/Modal/Modal";
import { ModalActions, ModalBody } from "./ConfirmModal.styles";

interface ConfirmModalProps {
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  children?: ReactNode;
}

export default function ConfirmModal({
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  children,
}: ConfirmModalProps) {
  return (
    <Modal onClose={onCancel}>
      <ModalBody>
        {children}
        <ModalActions>
          <Button kind="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button kind="primary" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </ModalActions>
      </ModalBody>
    </Modal>
  );
}
