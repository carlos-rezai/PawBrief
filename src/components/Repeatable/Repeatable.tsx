import type { ReactNode } from "react";
import Button from "../../primitives/Button/Button";
import {
  EntryCard,
  EntryHeader,
  EntryLabel,
  RemoveButton,
  RepeatableRoot,
} from "./Repeatable.styles";

interface RepeatableProps<T> {
  entries: T[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  renderEntry: (entry: T, index: number) => ReactNode;
}

export default function Repeatable<T>({
  entries,
  onAdd,
  onRemove,
  renderEntry,
}: RepeatableProps<T>) {
  return (
    <RepeatableRoot>
      {entries.map((entry, i) => (
        <EntryCard key={i}>
          <EntryHeader>
            <EntryLabel>Item {i + 1}</EntryLabel>
            <RemoveButton
              aria-label={`Remove entry ${i + 1}`}
              onClick={() => onRemove(i)}
            >
              ×
            </RemoveButton>
          </EntryHeader>
          {renderEntry(entry, i)}
        </EntryCard>
      ))}
      <Button kind="dashed" onClick={onAdd}>
        + Add
      </Button>
    </RepeatableRoot>
  );
}
