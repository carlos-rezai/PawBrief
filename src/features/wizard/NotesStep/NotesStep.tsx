import { useState } from "react";
import type { NotesData, SpecialNote } from "../../../types/profile";
import { validatePhoto } from "../../../utils/validatePhoto";
import { savePhoto } from "../../profile";
import {
  Button,
  Field,
  Input,
  PhotoUpload,
  Textarea,
} from "../../../primitives";
import { EntryList } from "../shared/entry.styles";
import { StepFooter, StepFooterSpacer } from "../shared/footer.styles";
import StepSection from "../shared/StepSection";
import { NoteCard } from "./NotesStep.styles";

interface NotesStepProps {
  onSave?: (data: NotesData) => void;
  onBack?: () => void;
  initialData?: NotesData;
  backLabel?: React.ReactNode;
  submitLabel?: React.ReactNode;
}

export default function NotesStep({
  onSave,
  onBack,
  initialData,
  backLabel = "Back",
  submitLabel = "Next",
}: NotesStepProps) {
  const [specialNotes, setSpecialNotes] = useState<SpecialNote[]>(
    initialData?.specialNotes ?? []
  );
  const [pendingPhotos, setPendingPhotos] = useState<Record<number, File>>({});
  const [photoErrors, setPhotoErrors] = useState<Record<number, string>>({});

  function handlePhotoChange(index: number, file: File) {
    const error = validatePhoto(file);
    if (error) {
      setPhotoErrors((prev) => ({ ...prev, [index]: error }));
    } else {
      setPhotoErrors((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
      setPendingPhotos((prev) => ({ ...prev, [index]: file }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const resolvedNotes = await Promise.all(
      specialNotes.map(async (note, i) => {
        const pendingFile = pendingPhotos[i];
        if (pendingFile) {
          const photoId = await savePhoto(pendingFile);
          return { ...note, photoId };
        }
        return note;
      })
    );
    onSave?.({ specialNotes: resolvedNotes });
  }

  return (
    <form onSubmit={handleSubmit}>
      <StepSection
        first
        title="Special notes"
        hint="Anything the other steps didn't cover — quirks, house rules, do's and don'ts."
      >
        <EntryList>
          {specialNotes.map((note, i) => (
            <NoteCard key={i} data-testid="special-note">
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
              <Field label="Description">
                <Textarea
                  value={note.body}
                  placeholder="What should the sitter know?"
                  onChange={(e) =>
                    setSpecialNotes((prev) =>
                      prev.map((n, idx) =>
                        idx === i ? { ...n, body: e.target.value } : n
                      )
                    )
                  }
                />
              </Field>
              <PhotoUpload
                label="Photo"
                height={96}
                onChange={(file) => handlePhotoChange(i, file)}
                error={photoErrors[i]}
              />
              <Button
                onClick={() =>
                  setSpecialNotes((prev) => prev.filter((_, idx) => idx !== i))
                }
              >
                Remove note
              </Button>
            </NoteCard>
          ))}
        </EntryList>
        <Button
          onClick={() =>
            setSpecialNotes((prev) => [...prev, { title: "", body: "" }])
          }
        >
          Add note
        </Button>
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
