import { useState } from "react";
import type { BasicsData } from "../../../types/profile";
import { validatePhoto } from "../../../utils/validatePhoto";
import { savePhoto } from "../../profile";
import { Button, Field, Select } from "../../../primitives";
import { StepFooter, StepFooterSpacer } from "../StepFooter.styles";
import {
  AgeGrid,
  BasicsBody,
  FieldsCol,
  PhotoCircle,
  PhotoCircleText,
  PhotoCol,
} from "./BasicsStep.styles";

const cameraIcon = (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="photo-circle-icon"
    style={{ color: "var(--pb-muted, #948675)", pointerEvents: "none" }}
  >
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

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
            {cameraIcon}
            <PhotoCircleText className="photo-circle-text">
              Add photo
            </PhotoCircleText>
            <input
              type="file"
              aria-label="Photo"
              onChange={handlePhotoChange}
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0,
                cursor: "pointer",
                width: "100%",
                height: "100%",
              }}
            />
          </PhotoCircle>
          {photoError && <p role="alert">{photoError}</p>}
        </PhotoCol>

        <FieldsCol>
          <Field label="Name">
            <input
              aria-label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%" }}
            />
          </Field>
          <Field label="Breed" optional>
            <input
              aria-label="Breed"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              style={{ width: "100%" }}
            />
          </Field>
          <Field label="Age">
            <AgeGrid>
              <input
                type="number"
                aria-label="Age"
                value={ageValue}
                onChange={(e) => setAgeValue(Number(e.target.value))}
                style={{ width: "100%" }}
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
