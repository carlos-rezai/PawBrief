import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfiles } from "../../features/profile";
import { Button, Checkbox } from "../../primitives";
import type { WizardStep } from "../../types/profile";
import { getNextStep } from "../../utils/getNextStep";

const ALL_STEPS: WizardStep[] = [
  "basics",
  "feeding",
  "routine",
  "favorites",
  "medical",
  "notes",
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { profiles, createProfile, deleteProfile } = useProfiles();
  const [mergeMode, setMergeMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  function toggleMergeSelect(id: string) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      if (prev.length < 2) {
        return [...prev, id];
      }
      return [prev[1], id];
    });
  }

  return (
    <main>
      <Button onClick={() => createProfile()}>+ New Profile</Button>
      <Button
        onClick={() => {
          setMergeMode(true);
          setSelectedIds([]);
        }}
      >
        Merge two profiles
      </Button>
      {mergeMode && selectedIds.length === 2 && (
        <Button
          onClick={() =>
            navigate(`/preview/merge/${selectedIds[0]}/${selectedIds[1]}`)
          }
        >
          Preview Merge
        </Button>
      )}
      {profiles.length === 0 ? (
        <p>Get started — create your first profile above.</p>
      ) : (
        <ul>
          {profiles.map((profile) => {
            const isComplete = ALL_STEPS.every((s) =>
              profile.completedSteps.includes(s)
            );
            const basics = profile.basics;
            return (
              <li key={profile.id}>
                {mergeMode && isComplete && (
                  <Checkbox
                    aria-label={basics?.name}
                    checked={selectedIds.includes(profile.id)}
                    onChange={() => toggleMergeSelect(profile.id)}
                  />
                )}
                {basics && (
                  <>
                    <p>{basics.name}</p>
                    {basics.breed && <p>{basics.breed}</p>}
                    <p>
                      {basics.ageValue} {basics.ageUnit}
                    </p>
                  </>
                )}
                {isComplete ? (
                  <>
                    <Button
                      onClick={() =>
                        navigate(`/wizard/${profile.id}/step/basics`)
                      }
                    >
                      Edit
                    </Button>
                    <Button onClick={() => navigate(`/preview/${profile.id}`)}>
                      Generate PDF
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => {
                      const nextStep = getNextStep(profile);
                      if (nextStep)
                        navigate(`/wizard/${profile.id}/step/${nextStep}`);
                    }}
                  >
                    Continue
                  </Button>
                )}
                <Button onClick={() => deleteProfile(profile.id)}>
                  Delete
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
