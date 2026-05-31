import { IconPlus } from "../../primitives/icons";
import {
  PlusCardHint,
  PlusCardLabel,
  PlusCardRoot,
  PlusCircle,
} from "./PlusCard.styles";

interface PlusCardProps {
  onClick: () => void;
}

export default function PlusCard({ onClick }: PlusCardProps) {
  return (
    <PlusCardRoot type="button" onClick={onClick}>
      <PlusCircle>
        <IconPlus />
      </PlusCircle>
      <PlusCardLabel>New cat profile</PlusCardLabel>
      <PlusCardHint>Start the care-guide wizard</PlusCardHint>
    </PlusCardRoot>
  );
}
