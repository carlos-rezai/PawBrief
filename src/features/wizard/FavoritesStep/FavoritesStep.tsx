import { useState } from "react";
import type {
  FavoritesData,
  ToyEntry,
  TreatEntry,
} from "../../../types/profile";
import { Button, Field, Input } from "../../../primitives";

interface FavoritesStepProps {
  onSave?: (data: FavoritesData) => void;
  onBack?: () => void;
  initialData?: FavoritesData;
}

export default function FavoritesStep({
  onSave,
  onBack,
  initialData,
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
      {toyEntries.map((entry, i) => (
        <div key={i} data-testid="toy-entry">
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
          <Field label="Description">
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
          <Button
            onClick={() =>
              setToyEntries((prev) => prev.filter((_, idx) => idx !== i))
            }
          >
            Remove toy
          </Button>
        </div>
      ))}
      <Button onClick={() => setToyEntries((prev) => [...prev, { name: "" }])}>
        Add toy
      </Button>

      {treatEntries.map((entry, i) => (
        <div key={i} data-testid="treat-entry">
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
          <Button
            onClick={() =>
              setTreatEntries((prev) => prev.filter((_, idx) => idx !== i))
            }
          >
            Remove treat
          </Button>
        </div>
      ))}
      <Button
        onClick={() =>
          setTreatEntries((prev) => [...prev, { brand: "", flavor: "" }])
        }
      >
        Add treat
      </Button>

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
      <Button onClick={() => setComfortItems((prev) => [...prev, ""])}>
        Add comfort item
      </Button>

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
              setFavouriteSpots((prev) => prev.filter((_, idx) => idx !== i))
            }
          >
            Remove favourite spot
          </Button>
        </div>
      ))}
      <Button onClick={() => setFavouriteSpots((prev) => [...prev, ""])}>
        Add favourite spot
      </Button>

      {onBack && <Button onClick={onBack}>Back</Button>}
      <Button type="submit">Next</Button>
    </form>
  );
}
