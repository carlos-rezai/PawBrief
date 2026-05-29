import { useNavigate } from "react-router-dom";
import { useProfiles } from "../../features/profile";
import { Button } from "../../primitives";
import type { WizardStep } from "../../types/profile";

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

  return (
    <main>
      <Button onClick={() => createProfile()}>+ New Profile</Button>
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
                {basics && (
                  <>
                    <p>{basics.name}</p>
                    {basics.breed && <p>{basics.breed}</p>}
                    <p>
                      {basics.ageValue} {basics.ageUnit}
                    </p>
                  </>
                )}
                <Button>Edit</Button>
                {isComplete ? (
                  <Button onClick={() => navigate(`/preview/${profile.id}`)}>
                    Generate PDF
                  </Button>
                ) : (
                  <Button>Continue</Button>
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
