import { useState } from "react";
import type { ActivitySlot, RoutineData } from "../../../types/profile";
import { Button } from "../../../primitives";
import { IconPlus, IconX } from "../../../primitives/icons";
import ColorPicker from "../../../components/ColorPicker/ColorPicker";
import RoutineChart from "../../../components/RoutineChart/RoutineChart";
import { routinePalette } from "../../../tokens";
import { StepFooter, StepFooterSpacer } from "../StepFooter.styles";
import { RemoveButton } from "../StepEntry.styles";
import {
  AddSlotButton,
  ChartBlock,
  ChartCaption,
  SlotHeaders,
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
  { label: "Cuddle time", start: "18:00", hours: 2, colorIndex: 3 },
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
        start: "08:00",
        hours: 1,
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
        <RoutineChart slots={slots} size={224} />
        <ChartCaption>
          Midnight sits at the top. Each block shows <strong>when</strong> it
          happens — overlaps and gaps are fine.
        </ChartCaption>
      </ChartBlock>

      <SlotHeaders>
        <span style={{ width: 14, flexShrink: 0 }} />
        <span style={{ flex: 1 }}>Activity</span>
        <span style={{ width: 104, flexShrink: 0 }}>Starts at</span>
        <span style={{ width: 62, flexShrink: 0 }}>Duration</span>
        <span style={{ width: 28, flexShrink: 0 }} />
      </SlotHeaders>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {slots.map((slot, i) => (
          <SlotRow key={i}>
            <ColorPicker
              palette={routinePalette}
              value={slot.colorIndex}
              onChange={(idx) => updateSlot(i, "colorIndex", idx)}
            />
            <SlotLabelInput
              aria-label="Activity label"
              value={slot.label}
              placeholder="Activity"
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
                min="0"
                max="24"
                step="0.5"
                onChange={(e) =>
                  updateSlot(i, "hours", Number(e.target.value) || 0)
                }
              />
              <SlotHoursSuffix>h</SlotHoursSuffix>
            </SlotHoursWrapper>
            <RemoveButton
              type="button"
              aria-label="Remove slot"
              onClick={() => removeSlot(i)}
            >
              <IconX size={12} />
            </RemoveButton>
          </SlotRow>
        ))}
      </div>

      <AddSlotButton type="button" onClick={addSlot}>
        <IconPlus size={15} />
        Add activity
      </AddSlotButton>

      <TotalLine data-testid="routine-total">
        {+total.toFixed(1)}h scheduled across the day
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
