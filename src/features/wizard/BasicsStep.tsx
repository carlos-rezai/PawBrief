import { useState } from "react";
import type { BasicsData } from "../../types/profile";
import { validatePhoto } from "../../utils/validatePhoto";

interface BasicsStepProps {
  onSave?: (data: BasicsData) => void;
}

export default function BasicsStep({ onSave }: BasicsStepProps) {
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [ageValue, setAgeValue] = useState(1);
  const [ageUnit, setAgeUnit] = useState<"years" | "months">("years");
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
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave?.({ name, breed, ageValue, ageUnit });
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label>
        Breed
        <input value={breed} onChange={(e) => setBreed(e.target.value)} />
      </label>
      <label>
        Age
        <input
          type="number"
          value={ageValue}
          onChange={(e) => setAgeValue(Number(e.target.value))}
        />
        <select
          value={ageUnit}
          onChange={(e) => setAgeUnit(e.target.value as "years" | "months")}
        >
          <option value="years">years</option>
          <option value="months">months</option>
        </select>
      </label>
      <label>
        Photo
        <input type="file" onChange={handlePhotoChange} />
      </label>
      {photoError && <p role="alert">{photoError}</p>}
      <button type="submit">Next</button>
    </form>
  );
}
