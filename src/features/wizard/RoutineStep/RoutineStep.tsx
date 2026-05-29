import { useState } from "react";
import type { ActivitySlot, RoutineData } from "../../../types/profile";
import { Button, Input } from "../../../primitives";

interface RoutineStepProps {
  onSave?: (data: RoutineData) => void;
  onBack?: () => void;
  initialData?: RoutineData;
}

const DEFAULT_SLOTS: ActivitySlot[] = [
  { label: "Sleep", durationHours: 14 },
  { label: "Playtime", durationHours: 3 },
  { label: "Feeding", durationHours: 1 },
  { label: "Outdoor time", durationHours: 2 },
  { label: "Cuddle time", durationHours: 2 },
  { label: "Other", durationHours: 2 },
];

export default function RoutineStep({
  onSave,
  onBack,
  initialData,
}: RoutineStepProps) {
  const [slots, setSlots] = useState<ActivitySlot[]>(
    initialData?.slots ?? DEFAULT_SLOTS
  );

  const total = slots.reduce((sum, slot) => sum + (slot.durationHours || 0), 0);
  const showWarning = total !== 24;

  function updateSlot(
    index: number,
    field: keyof ActivitySlot,
    value: string | number
  ) {
    setSlots((prev) =>
      prev.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot))
    );
  }

  function addSlot() {
    setSlots((prev) => [...prev, { label: "", durationHours: 0 }]);
  }

  function removeSlot(index: number) {
    setSlots((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave?.({ slots });
  }

  return (
    <form onSubmit={handleSubmit}>
      <table>
        <thead>
          <tr>
            <th>Activity</th>
            <th>Hours</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {slots.map((slot, i) => (
            <tr key={i}>
              <td>
                <Input
                  aria-label="Activity label"
                  value={slot.label}
                  onChange={(e) => updateSlot(i, "label", e.target.value)}
                />
              </td>
              <td>
                <Input
                  aria-label="Duration"
                  type="number"
                  value={slot.durationHours}
                  onChange={(e) =>
                    updateSlot(i, "durationHours", Number(e.target.value) || 0)
                  }
                />
              </td>
              <td>
                <Button onClick={() => removeSlot(i)}>Remove slot</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <span data-testid="routine-total">{total}</span>
      {showWarning && (
        <p role="status">Total is {total}h — adjust slots to reach 24h.</p>
      )}

      <Button onClick={addSlot}>Add slot</Button>

      {onBack && <Button onClick={onBack}>Back</Button>}
      <Button type="submit">Next</Button>
    </form>
  );
}
