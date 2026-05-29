import { useState } from "react";
import type {
  FeedingData,
  FoodEntry,
  SupplementEntry,
} from "../../../types/profile";
import { validatePhoto } from "../../../utils/validatePhoto";
import { Button, Field, Input, Textarea } from "../../../primitives";

interface FeedingStepProps {
  onSave?: (data: FeedingData) => void;
  onBack?: () => void;
  initialData?: FeedingData;
}

export default function FeedingStep({
  onSave,
  onBack,
  initialData,
}: FeedingStepProps) {
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>(
    initialData?.foodEntries ?? []
  );
  const [servingGrams, setServingGrams] = useState(
    initialData?.servingGrams ?? 0
  );
  const [feedingTimes, setFeedingTimes] = useState<string[]>(
    initialData?.feedingTimes ?? []
  );
  const [supplementEntries, setSupplementEntries] = useState<SupplementEntry[]>(
    initialData?.supplementEntries ?? []
  );
  const [platingInstructions, setPlatingInstructions] = useState(
    initialData?.platingInstructions ?? ""
  );
  const [dietaryNotes, setDietaryNotes] = useState(
    initialData?.dietaryNotes ?? ""
  );
  const [photoError, setPhotoError] = useState<string | null>(null);

  function addFoodEntry() {
    setFoodEntries((prev) => [...prev, { brand: "", flavor: "", texture: "" }]);
  }

  function updateFoodEntry(
    index: number,
    field: keyof FoodEntry,
    value: string
  ) {
    setFoodEntries((prev) =>
      prev.map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry
      )
    );
  }

  function removeFoodEntry(index: number) {
    setFoodEntries((prev) => prev.filter((_, i) => i !== index));
  }

  function addFeedingTime() {
    setFeedingTimes((prev) => [...prev, ""]);
  }

  function updateFeedingTime(index: number, value: string) {
    setFeedingTimes((prev) => prev.map((t, i) => (i === index ? value : t)));
  }

  function removeFeedingTime(index: number) {
    setFeedingTimes((prev) => prev.filter((_, i) => i !== index));
  }

  function addSupplement() {
    setSupplementEntries((prev) => [...prev, { brand: "", flavor: "" }]);
  }

  function updateSupplement(
    index: number,
    field: keyof SupplementEntry,
    value: string
  ) {
    setSupplementEntries((prev) =>
      prev.map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry
      )
    );
  }

  function removeSupplement(index: number) {
    setSupplementEntries((prev) => prev.filter((_, i) => i !== index));
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const error = validatePhoto(file);
    if (error) {
      setPhotoError(error);
      e.target.value = "";
      return;
    }
    setPhotoError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave?.({
      foodEntries,
      servingGrams,
      feedingTimes,
      supplementEntries,
      platingInstructions,
      dietaryNotes,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      {foodEntries.map((entry, i) => (
        <div key={i}>
          <Field label="Brand">
            <Input
              value={entry.brand}
              onChange={(e) => updateFoodEntry(i, "brand", e.target.value)}
            />
          </Field>
          <Field label="Flavor">
            <Input
              value={entry.flavor}
              onChange={(e) => updateFoodEntry(i, "flavor", e.target.value)}
            />
          </Field>
          <Field label="Texture">
            <Input
              value={entry.texture}
              onChange={(e) => updateFoodEntry(i, "texture", e.target.value)}
            />
          </Field>
          <Button onClick={() => removeFoodEntry(i)}>Remove food entry</Button>
        </div>
      ))}
      <Button onClick={addFoodEntry}>Add food entry</Button>

      <Field label="Serving amount (g)">
        <Input
          type="number"
          value={servingGrams}
          onChange={(e) => setServingGrams(Number(e.target.value))}
        />
      </Field>

      {feedingTimes.map((time, i) => (
        <div key={i}>
          <Field label="Feeding time">
            <Input
              type="time"
              value={time}
              onChange={(e) => updateFeedingTime(i, e.target.value)}
            />
          </Field>
          <Button onClick={() => removeFeedingTime(i)}>
            Remove feeding time
          </Button>
        </div>
      ))}
      <Button onClick={addFeedingTime}>Add feeding time</Button>

      {supplementEntries.map((entry, i) => (
        <div key={i} data-testid="supplement-entry">
          <Field label="Brand">
            <Input
              value={entry.brand}
              onChange={(e) => updateSupplement(i, "brand", e.target.value)}
            />
          </Field>
          <Field label="Flavor">
            <Input
              value={entry.flavor}
              onChange={(e) => updateSupplement(i, "flavor", e.target.value)}
            />
          </Field>
          <Button onClick={() => removeSupplement(i)}>Remove supplement</Button>
        </div>
      ))}
      <Button onClick={addSupplement}>Add supplement</Button>

      <Field label="Plating instructions">
        <Textarea
          value={platingInstructions}
          onChange={(e) => setPlatingInstructions(e.target.value)}
        />
      </Field>

      <Field label="Plating photo">
        <Input type="file" onChange={handlePhotoChange} />
      </Field>
      {photoError && <p role="alert">{photoError}</p>}

      <Field label="Dietary notes">
        <Textarea
          value={dietaryNotes}
          onChange={(e) => setDietaryNotes(e.target.value)}
        />
      </Field>

      {onBack && <Button onClick={onBack}>Back</Button>}
      <Button type="submit">Next</Button>
    </form>
  );
}
