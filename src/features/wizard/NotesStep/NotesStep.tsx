import { useState } from "react";
import type { NotesData, SpecialNote } from "../../../types/profile";
import { validatePhoto } from "../../../utils/validatePhoto";
import { Button, Field, Input, Textarea } from "../../../primitives";

interface NotesStepProps {
  onSave?: (data: NotesData) => void;
  onBack?: () => void;
  initialData?: NotesData;
}

export default function NotesStep({
  onSave,
  onBack,
  initialData,
}: NotesStepProps) {
  const [specialNotes, setSpecialNotes] = useState<SpecialNote[]>(
    initialData?.specialNotes ?? []
  );
  const [photoErrors, setPhotoErrors] = useState<Record<number, string>>({});

  function handlePhotoChange(
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    const error = validatePhoto(file);
    if (error) {
      setPhotoErrors((prev) => ({ ...prev, [index]: error }));
      e.target.value = "";
    } else {
      setPhotoErrors((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave?.({ specialNotes });
  }

  return (
    <form onSubmit={handleSubmit}>
      {specialNotes.map((note, i) => (
        <div key={i} data-testid="special-note">
          <Field label="Title">
            <Input
              value={note.title}
              onChange={(e) =>
                setSpecialNotes((prev) =>
                  prev.map((n, idx) =>
                    idx === i ? { ...n, title: e.target.value } : n
                  )
                )
              }
            />
          </Field>
          <Field label="Body">
            <Textarea
              value={note.body}
              onChange={(e) =>
                setSpecialNotes((prev) =>
                  prev.map((n, idx) =>
                    idx === i ? { ...n, body: e.target.value } : n
                  )
                )
              }
            />
          </Field>
          <Field label="Photo">
            <Input type="file" onChange={(e) => handlePhotoChange(i, e)} />
          </Field>
          {photoErrors[i] && <p role="alert">{photoErrors[i]}</p>}
          <Button
            onClick={() =>
              setSpecialNotes((prev) => prev.filter((_, idx) => idx !== i))
            }
          >
            Remove note
          </Button>
        </div>
      ))}
      <Button
        onClick={() =>
          setSpecialNotes((prev) => [...prev, { title: "", body: "" }])
        }
      >
        Add note
      </Button>

      {onBack && <Button onClick={onBack}>Back</Button>}
      <Button type="submit">Next</Button>
    </form>
  );
}
