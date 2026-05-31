import {
  PlusCardHint,
  PlusCardLabel,
  PlusCardRoot,
  PlusCircle,
} from "./PlusCard.styles";

interface PlusCardProps {
  onClick: () => void;
}

const plusIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
    style={{ color: "#A0502B" }}
  >
    <path d="M8 3v10M3 8h10" />
  </svg>
);

export default function PlusCard({ onClick }: PlusCardProps) {
  return (
    <PlusCardRoot type="button" onClick={onClick}>
      <PlusCircle>{plusIcon}</PlusCircle>
      <PlusCardLabel>New cat profile</PlusCardLabel>
      <PlusCardHint>Start the care-guide wizard</PlusCardHint>
    </PlusCardRoot>
  );
}
