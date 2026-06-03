import { useEffect, useRef, useState } from "react";
import { Popover, SwatchButton, SwatchWrapper } from "./ColorPicker.styles";

interface ColorPickerProps {
  palette: readonly string[];
  value: number;
  onChange: (index: number) => void;
}

export default function ColorPicker({
  palette,
  value,
  onChange,
}: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <SwatchWrapper ref={ref}>
      <SwatchButton
        type="button"
        $color={palette[value % palette.length]}
        onClick={() => setOpen((v) => !v)}
        aria-label="Pick colour"
        title="Pick colour"
      />
      {open && (
        <Popover role="listbox" aria-label="Colour palette">
          {palette.map((color, i) => (
            <SwatchButton
              key={color}
              type="button"
              $color={color}
              $size={20}
              $active={i === value}
              role="option"
              aria-selected={i === value}
              aria-label={`Colour ${i + 1}`}
              onClick={() => {
                onChange(i);
                setOpen(false);
              }}
            />
          ))}
        </Popover>
      )}
    </SwatchWrapper>
  );
}
