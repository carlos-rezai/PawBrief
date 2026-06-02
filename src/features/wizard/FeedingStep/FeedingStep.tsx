import { useEffect, useState } from "react";
import type {
  FeedingData,
  FoodEntry,
  ServingEntry,
  SupplementEntry,
} from "../../../types/profile";
import { validatePhoto } from "../../../utils/validatePhoto";
import { savePhoto } from "../../profile";
import {
  Button,
  Field,
  Input,
  PhotoUpload,
  Textarea,
} from "../../../primitives";
import { IconPlus, IconX } from "../../../primitives/icons";
import { StepFooter, StepFooterSpacer } from "../StepFooter.styles";
import StepSection from "../StepSection";
import {
  AddEntryButton,
  EntryCard,
  EntryHeader,
  EntryLabel,
  EntryList,
  RemoveButton,
} from "../StepEntry.styles";
import {
  ServingHeaders,
  ServingRow,
  ThreeColGrid,
  TwoColGrid,
} from "./FeedingStep.styles";

interface FeedingStepProps {
  onSave?: (data: FeedingData) => void;
  onBack?: () => void;
  initialData?: FeedingData;
  backLabel?: React.ReactNode;
  submitLabel?: React.ReactNode;
}

export default function FeedingStep({
  onSave,
  onBack,
  initialData,
  backLabel = "Back",
  submitLabel = "Next",
}: FeedingStepProps) {
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>(
    initialData?.foodEntries ?? []
  );
  const [servings, setServings] = useState<ServingEntry[]>(
    initialData?.servings ?? []
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
  const [pendingPlatingPhoto, setPendingPlatingPhoto] = useState<File | null>(
    null
  );
  const [platingPreviewUrl, setPlatingPreviewUrl] = useState<string | null>(
    null
  );
  const [photoError, setPhotoError] = useState<string | null>(null);

  useEffect(() => {
    if (!pendingPlatingPhoto) return;
    let url: string | null = null;
    try {
      url = URL.createObjectURL(pendingPlatingPhoto);
      setPlatingPreviewUrl(url);
    } catch {
      // not available in some test environments
    }
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [pendingPlatingPhoto]);

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

  function addServing() {
    setServings((prev) => [...prev, { grams: 0, time: "" }]);
  }

  function updateServing(
    index: number,
    field: keyof ServingEntry,
    value: string
  ) {
    setServings((prev) =>
      prev.map((s, i) =>
        i === index
          ? { ...s, [field]: field === "grams" ? Number(value) : value }
          : s
      )
    );
  }

  function removeServing(index: number) {
    setServings((prev) => prev.filter((_, i) => i !== index));
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

  function handlePhotoChange(file: File) {
    const error = validatePhoto(file);
    if (error) {
      setPhotoError(error);
      return;
    }
    setPhotoError(null);
    setPendingPlatingPhoto(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let platingPhotoId = initialData?.platingPhotoId;
    if (pendingPlatingPhoto) {
      platingPhotoId = await savePhoto(pendingPlatingPhoto);
    }
    onSave?.({
      foodEntries,
      servings,
      supplementEntries,
      platingInstructions,
      platingPhotoId,
      dietaryNotes,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <StepSection
        first
        title="Food"
        hint="What you serve, and how it's prepared."
      >
        <EntryList>
          {foodEntries.map((entry, i) => (
            <EntryCard key={i}>
              <EntryHeader>
                <EntryLabel>Food {i + 1}</EntryLabel>
                <RemoveButton
                  type="button"
                  title="Remove food entry"
                  onClick={() => removeFoodEntry(i)}
                >
                  <IconX />
                </RemoveButton>
              </EntryHeader>
              <ThreeColGrid>
                <Field label="Brand">
                  <Input
                    value={entry.brand}
                    onChange={(e) =>
                      updateFoodEntry(i, "brand", e.target.value)
                    }
                  />
                </Field>
                <Field label="Flavor">
                  <Input
                    value={entry.flavor}
                    onChange={(e) =>
                      updateFoodEntry(i, "flavor", e.target.value)
                    }
                  />
                </Field>
                <Field label="Texture">
                  <Input
                    value={entry.texture}
                    onChange={(e) =>
                      updateFoodEntry(i, "texture", e.target.value)
                    }
                  />
                </Field>
              </ThreeColGrid>
            </EntryCard>
          ))}
        </EntryList>
        <AddEntryButton type="button" onClick={addFoodEntry}>
          <IconPlus size={14} /> Add food entry
        </AddEntryButton>
      </StepSection>

      <StepSection title="Serving">
        <div>
          {servings.length > 0 && (
            <ServingHeaders>
              <span>Amount (g)</span>
              <span>Time</span>
              <span />
            </ServingHeaders>
          )}
          <EntryList>
            {servings.map((s, i) => (
              <ServingRow key={i}>
                <Input
                  type="number"
                  aria-label="Serving amount"
                  value={s.grams}
                  onChange={(e) => updateServing(i, "grams", e.target.value)}
                  placeholder="70"
                />
                <Input
                  type="time"
                  aria-label="Feeding time"
                  value={s.time}
                  onChange={(e) => updateServing(i, "time", e.target.value)}
                />
                <RemoveButton
                  type="button"
                  title="Remove serving"
                  onClick={() => removeServing(i)}
                >
                  <IconX />
                </RemoveButton>
              </ServingRow>
            ))}
          </EntryList>
        </div>
        <AddEntryButton type="button" onClick={addServing}>
          <IconPlus size={14} /> Add serving
        </AddEntryButton>
      </StepSection>

      <StepSection
        title="Supplements"
        hint="Vitamins or routine additions — not prescribed medications."
      >
        <EntryList>
          {supplementEntries.map((entry, i) => (
            <EntryCard key={i} data-testid="supplement-entry">
              <EntryHeader>
                <EntryLabel>Supplement {i + 1}</EntryLabel>
                <RemoveButton
                  type="button"
                  title="Remove supplement"
                  onClick={() => removeSupplement(i)}
                >
                  <IconX />
                </RemoveButton>
              </EntryHeader>
              <TwoColGrid>
                <Field label="Brand">
                  <Input
                    value={entry.brand}
                    onChange={(e) =>
                      updateSupplement(i, "brand", e.target.value)
                    }
                  />
                </Field>
                <Field label="Flavor">
                  <Input
                    value={entry.flavor}
                    onChange={(e) =>
                      updateSupplement(i, "flavor", e.target.value)
                    }
                  />
                </Field>
              </TwoColGrid>
            </EntryCard>
          ))}
        </EntryList>
        <AddEntryButton type="button" onClick={addSupplement}>
          <IconPlus size={14} /> Add supplement
        </AddEntryButton>
      </StepSection>

      <StepSection
        title="Plating instructions"
        hint="How to prepare or serve — add a photo if it helps."
      >
        <Field label="Plating instructions">
          <Textarea
            value={platingInstructions}
            onChange={(e) => setPlatingInstructions(e.target.value)}
          />
        </Field>
        <PhotoUpload
          label="Plating photo"
          height={108}
          previewUrl={platingPreviewUrl}
          onChange={handlePhotoChange}
          error={photoError}
        />
      </StepSection>

      <StepSection title="Dietary notes">
        <Field label="Dietary notes">
          <Textarea
            value={dietaryNotes}
            placeholder="Allergies, sensitivities, anything to avoid…"
            onChange={(e) => setDietaryNotes(e.target.value)}
          />
        </Field>
      </StepSection>

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
