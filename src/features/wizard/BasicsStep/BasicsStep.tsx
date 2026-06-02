import { useEffect, useState } from "react";
import type { BasicsData } from "../../../types/profile";
import { validatePhoto } from "../../../utils/validatePhoto";
import { getPhoto, savePhoto } from "../../profile";
import { Button, Field, Input, PhotoUpload, Select } from "../../../primitives";
import { StepFooter, StepFooterSpacer } from "../StepFooter.styles";
import { AgeGrid, BasicsBody, FieldsCol, PhotoCol } from "./BasicsStep.styles";

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Immediate preview from a newly selected file
  useEffect(() => {
    if (!pendingPhoto) return;
    let url: string | null = null;
    try {
      url = URL.createObjectURL(pendingPhoto);
      setPreviewUrl(url);
    } catch {
      // not available in some test environments
    }
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [pendingPhoto]);

  // Preview from an existing stored photo when editing a profile
  useEffect(() => {
    if (!initialData?.photoId) return;
    let active = true;
    let objectUrl: string | null = null;
    getPhoto(initialData.photoId).then((blob) => {
      if (!active || !blob) return;
      try {
        objectUrl = URL.createObjectURL(blob);
        setPreviewUrl(objectUrl);
      } catch {
        // not available in some test environments
      }
    });
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [initialData?.photoId]);

  function handlePhotoChange(file: File) {
    const error = validatePhoto(file);
    if (error) {
      setPhotoError(error);
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
          <PhotoUpload
            label="Photo"
            round
            height={124}
            previewUrl={previewUrl}
            previewAlt="Cat photo preview"
            onChange={handlePhotoChange}
            error={photoError}
          />
        </PhotoCol>

        <FieldsCol>
          <Field label="Name">
            <Input
              aria-label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Field label="Breed" optional>
            <Input
              aria-label="Breed"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
            />
          </Field>
          <Field label="Age">
            <AgeGrid>
              <Input
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
