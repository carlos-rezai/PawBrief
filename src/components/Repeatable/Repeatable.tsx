import type { ReactNode } from "react";
import Button from "../../primitives/Button/Button";

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
    <div>
      {entries.map((entry, i) => (
        <div key={i}>
          {renderEntry(entry, i)}
          <Button
            kind="ghost"
            iconOnly
            aria-label={`Remove entry ${i + 1}`}
            onClick={() => onRemove(i)}
          >
            ×
          </Button>
        </div>
      ))}
      <Button kind="dashed" onClick={onAdd}>
        Add
      </Button>
    </div>
  );
}
