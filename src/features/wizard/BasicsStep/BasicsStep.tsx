import { useState } from "react";
import type { BasicsData } from "../../../types/profile";
import { validatePhoto } from "../../../utils/validatePhoto";
import { savePhoto } from "../../profile";
import { Button, Field, Select } from "../../../primitives";
import { IconCamera } from "../../../primitives/icons";
import { StepFooter, StepFooterSpacer } from "../StepFooter.styles";
import {
  AgeGrid,
  BasicsBody,
  FieldsCol,
  FullInput,
  PhotoCircle,
  PhotoCircleText,
  PhotoCol,
  PhotoFileInput,
} from "./BasicsStep.styles";

interface BasicsStepProps {
  onSave?: (data: BasicsData) => void;
  onBack?: () => void;
  initialData?: BasicsData;
  backLabel?: React.ReactNode;
  submitLabel?: React.ReactNode;
}

export default function BasicsStep({
  onSave,
  onBack,
  initialData,
  backLabel = "Back",
  submitLabel = "Next",
}: BasicsStepProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [breed, setBreed] = useState(initialData?.breed ?? "");
  const [ageValue, setAgeValue] = useState(initialData?.ageValue ?? 1);
  const [ageUnit, setAgeUnit] = useState<"years" | "months">(
    initialData?.ageUnit ?? "years"
  );
  const [pendingPhoto, setPendingPhoto] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

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
    setPendingPhoto(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let photoId = initialData?.photoId;
    if (pendingPhoto) {
      photoId = await savePhoto(pendingPhoto);
    }
    onSave?.({ name, breed, ageValue, ageUnit, photoId });
  }

  return (
    <form onSubmit={handleSubmit}>
      <BasicsBody>
        <PhotoCol>
          <PhotoCircle>
            <IconCamera />
            <PhotoCircleText className="photo-circle-text">
              Add photo
            </PhotoCircleText>
            <PhotoFileInput
              type="file"
              aria-label="Photo"
              onChange={handlePhotoChange}
            />
          </PhotoCircle>
          {photoError && <p role="alert">{photoError}</p>}
        </PhotoCol>

        <FieldsCol>
          <Field label="Name">
            <FullInput
              aria-label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Field label="Breed" optional>
            <FullInput
              aria-label="Breed"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
            />
          </Field>
          <Field label="Age">
            <AgeGrid>
              <FullInput
                type="number"
                aria-label="Age"
                value={ageValue}
                onChange={(e) => setAgeValue(Number(e.target.value))}
              />
              <Select
                value={ageUnit}
                onChange={(e) =>
                  setAgeUnit(e.target.value as "years" | "months")
                }
              >
                <option value="years">years</option>
                <option value="months">months</option>
              </Select>
            </AgeGrid>
          </Field>
        </FieldsCol>
      </BasicsBody>

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
