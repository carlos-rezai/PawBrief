import type { ReactNode } from "react";
import Button from "../../primitives/Button/Button";
import Modal from "../../primitives/Modal/Modal";

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
      {children}
      <div>
        <Button onClick={onCancel}>{cancelLabel}</Button>
        <Button onClick={onConfirm}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}
