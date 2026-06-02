import { useState } from "react";
import type {
  FavoritesData,
  ToyEntry,
  TreatEntry,
} from "../../../types/profile";
import { Field, Input } from "../../../primitives";
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
import { ToyGrid, TreatGrid } from "./FavoritesStep.styles";
import { Button } from "../../../primitives";

interface FavoritesStepProps {
  onSave?: (data: FavoritesData) => void;
  onBack?: () => void;
  initialData?: FavoritesData;
  backLabel?: React.ReactNode;
  submitLabel?: React.ReactNode;
}

export default function FavoritesStep({
  onSave,
  onBack,
  initialData,
  backLabel = "Back",
  submitLabel = "Next",
}: FavoritesStepProps) {
  const [toyEntries, setToyEntries] = useState<ToyEntry[]>(
    initialData?.toyEntries ?? []
  );
  const [treatEntries, setTreatEntries] = useState<TreatEntry[]>(
    initialData?.treatEntries ?? []
  );
  const [comfortItems, setComfortItems] = useState<string[]>(
    initialData?.comfortItems ?? []
  );
  const [favouriteSpots, setFavouriteSpots] = useState<string[]>(
    initialData?.favouriteSpots ?? []
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave?.({ toyEntries, treatEntries, comfortItems, favouriteSpots });
  }

  return (
    <form onSubmit={handleSubmit}>
      <StepSection first title="Toys">
        <EntryList>
          {toyEntries.map((entry, i) => (
            <EntryCard key={i} data-testid="toy-entry">
              <EntryHeader>
                <EntryLabel>Toy {i + 1}</EntryLabel>
                <RemoveButton
                  type="button"
                  title="Remove toy"
                  onClick={() =>
                    setToyEntries((prev) => prev.filter((_, idx) => idx !== i))
                  }
                >
                  <IconX />
                </RemoveButton>
              </EntryHeader>
              <ToyGrid>
                <Field label="Name">
                  <Input
                    value={entry.name}
                    onChange={(e) =>
                      setToyEntries((prev) =>
                        prev.map((t, idx) =>
                          idx === i ? { ...t, name: e.target.value } : t
                        )
                      )
                    }
                  />
                </Field>
                <Field label="Description" optional>
                  <Input
                    value={entry.description ?? ""}
                    onChange={(e) =>
                      setToyEntries((prev) =>
                        prev.map((t, idx) =>
                          idx === i ? { ...t, description: e.target.value } : t
                        )
                      )
                    }
                  />
                </Field>
              </ToyGrid>
            </EntryCard>
          ))}
        </EntryList>
        <AddEntryButton
          type="button"
          onClick={() => setToyEntries((prev) => [...prev, { name: "" }])}
        >
          <IconPlus size={14} /> Add toy
        </AddEntryButton>
      </StepSection>

      <StepSection title="Treats">
        <EntryList>
          {treatEntries.map((entry, i) => (
            <EntryCard key={i} data-testid="treat-entry">
              <EntryHeader>
                <EntryLabel>Treat {i + 1}</EntryLabel>
                <RemoveButton
                  type="button"
                  title="Remove treat"
                  onClick={() =>
                    setTreatEntries((prev) =>
                      prev.filter((_, idx) => idx !== i)
                    )
                  }
                >
                  <IconX />
                </RemoveButton>
              </EntryHeader>
              <TreatGrid>
                <Field label="Brand">
                  <Input
                    value={entry.brand}
                    onChange={(e) =>
                      setTreatEntries((prev) =>
                        prev.map((t, idx) =>
                          idx === i ? { ...t, brand: e.target.value } : t
                        )
                      )
                    }
                  />
                </Field>
                <Field label="Flavor">
                  <Input
                    value={entry.flavor}
                    onChange={(e) =>
                      setTreatEntries((prev) =>
                        prev.map((t, idx) =>
                          idx === i ? { ...t, flavor: e.target.value } : t
                        )
                      )
                    }
                  />
                </Field>
              </TreatGrid>
            </EntryCard>
          ))}
        </EntryList>
        <AddEntryButton
          type="button"
          onClick={() =>
            setTreatEntries((prev) => [...prev, { brand: "", flavor: "" }])
          }
        >
          <IconPlus size={14} /> Add treat
        </AddEntryButton>
      </StepSection>

      <StepSection
        title="Comfort items"
        hint="Blankets, beds, anything that soothes them."
      >
        <EntryList>
          {comfortItems.map((item, i) => (
            <div key={i} data-testid="comfort-item">
              <Field label="Comfort item">
                <Input
                  value={item}
                  onChange={(e) =>
                    setComfortItems((prev) =>
                      prev.map((c, idx) => (idx === i ? e.target.value : c))
                    )
                  }
                />
              </Field>
              <Button
                onClick={() =>
                  setComfortItems((prev) => prev.filter((_, idx) => idx !== i))
                }
              >
                Remove comfort item
              </Button>
            </div>
          ))}
        </EntryList>
        <Button onClick={() => setComfortItems((prev) => [...prev, ""])}>
          Add comfort item
        </Button>
      </StepSection>

      <StepSection title="Favourite spots">
        <EntryList>
          {favouriteSpots.map((spot, i) => (
            <div key={i} data-testid="favourite-spot">
              <Field label="Favourite spot">
                <Input
                  value={spot}
                  onChange={(e) =>
                    setFavouriteSpots((prev) =>
                      prev.map((s, idx) => (idx === i ? e.target.value : s))
                    )
                  }
                />
              </Field>
              <Button
                onClick={() =>
                  setFavouriteSpots((prev) =>
                    prev.filter((_, idx) => idx !== i)
                  )
                }
              >
                Remove favourite spot
              </Button>
            </div>
          ))}
        </EntryList>
        <Button onClick={() => setFavouriteSpots((prev) => [...prev, ""])}>
          Add favourite spot
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
