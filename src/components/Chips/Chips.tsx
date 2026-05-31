import { useState } from "react";
import Button from "../../primitives/Button/Button";
import Input from "../../primitives/Input/Input";
import {
  Chip,
  ChipRemove,
  ChipsList,
  ChipsRoot,
  InputRow,
} from "./Chips.styles";

interface ChipsProps {
  values: string[];
  onChange: (values: string[]) => void;
}

export default function Chips({ values, onChange }: ChipsProps) {
  const [input, setInput] = useState("");

  const add = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onChange([...values, trimmed]);
    setInput("");
  };

  return (
    <ChipsRoot>
      <InputRow>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <Button kind="secondary" onClick={add}>
          Add
        </Button>
      </InputRow>
      {values.length > 0 && (
        <ChipsList>
          {values.map((v, i) => (
            <Chip key={i}>
              {v}
              <ChipRemove
                aria-label={`Remove ${v}`}
                onClick={() => onChange(values.filter((_, j) => j !== i))}
              >
                ×
              </ChipRemove>
            </Chip>
          ))}
        </ChipsList>
      )}
    </ChipsRoot>
  );
}
