import { useState } from "react";
import type { ActivitySlot, RoutineData } from "../../../types/profile";
import { Button, Input } from "../../../primitives";
import RoutineChart from "../../../components/RoutineChart/RoutineChart";
import { routinePalette } from "../../../tokens";
import { StepFooter, StepFooterSpacer } from "../StepFooter.styles";
import {
  AddSlotButton,
  ChartBlock,
  ChartCaption,
  ColorDot,
  SlotHoursInput,
  SlotHoursSuffix,
  SlotHoursWrapper,
  SlotLabelInput,
  SlotRow,
  SlotTimeInput,
  TotalLine,
} from "./RoutineStep.styles";

interface RoutineStepProps {
  onSave?: (data: RoutineData) => void;
  onBack?: () => void;
  initialData?: RoutineData;
  backLabel?: React.ReactNode;
  submitLabel?: React.ReactNode;
}

const DEFAULT_SLOTS: ActivitySlot[] = [
  { label: "Sleep", start: "22:30", hours: 8.5, colorIndex: 0 },
  { label: "Feeding", start: "07:30", hours: 1, colorIndex: 1 },
  { label: "Playtime", start: "09:00", hours: 2, colorIndex: 2 },
  { label: "Outdoor time", start: "11:00", hours: 2, colorIndex: 3 },
  { label: "Cuddle time", start: "18:00", hours: 2, colorIndex: 4 },
  { label: "Window watching", start: "14:00", hours: 2, colorIndex: 5 },
];

export default function RoutineStep({
  onSave,
  onBack,
  initialData,
  backLabel = "Back",
  submitLabel = "Next",
}: RoutineStepProps) {
  const [slots, setSlots] = useState<ActivitySlot[]>(
    initialData?.slots ?? DEFAULT_SLOTS
  );

  const total = slots.reduce((sum, slot) => sum + (slot.hours || 0), 0);

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
    setSlots((prev) => [
      ...prev,
      {
        label: "",
        start: "00:00",
        hours: 0,
        colorIndex: prev.length % routinePalette.length,
      },
    ]);
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
      <ChartBlock>
        <RoutineChart slots={slots} size={200} />
        <ChartCaption>
          Midnight sits at the top. Each block shows <strong>when</strong> it
          happens — overlaps and gaps are fine. Colours are assigned
          automatically.
        </ChartCaption>
      </ChartBlock>

      {slots.map((slot, i) => (
        <SlotRow key={i}>
          <ColorDot
            $color={routinePalette[slot.colorIndex % routinePalette.length]}
          />
          <SlotLabelInput
            aria-label="Activity label"
            value={slot.label}
            onChange={(e) => updateSlot(i, "label", e.target.value)}
          />
          <SlotTimeInput
            type="time"
            aria-label="Start time"
            value={slot.start}
            onChange={(e) => updateSlot(i, "start", e.target.value)}
          />
          <SlotHoursWrapper>
            <SlotHoursInput
              type="number"
              aria-label="Duration"
              value={slot.hours}
              onChange={(e) =>
                updateSlot(i, "hours", Number(e.target.value) || 0)
              }
            />
            <SlotHoursSuffix>h</SlotHoursSuffix>
          </SlotHoursWrapper>
          <Button onClick={() => removeSlot(i)}>Remove slot</Button>
        </SlotRow>
      ))}

      <AddSlotButton type="button" onClick={addSlot}>
        + Add slot
      </AddSlotButton>

      <TotalLine data-testid="routine-total">
        {total}h scheduled across the day
      </TotalLine>

      <StepFooter>
        <Button onClick={onBack}>{backLabel}</Button>
        <StepFooterSpacer />
        <Button type="submit" kind="primary">
          {submitLabel}
        </Button>
      </StepFooter>
    </form>
  );
}
