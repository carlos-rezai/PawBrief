import { useState } from "react";
import Button from "../../primitives/Button/Button";
import Input from "../../primitives/Input/Input";

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
    <div>
      <div style={{ display: "flex", gap: 8 }}>
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
      </div>
      {values.map((v, i) => (
        <span key={i}>
          {v}
          <Button
            kind="ghost"
            iconOnly
            aria-label={`Remove ${v}`}
            onClick={() => onChange(values.filter((_, j) => j !== i))}
          >
            ×
          </Button>
        </span>
      ))}
    </div>
  );
}
