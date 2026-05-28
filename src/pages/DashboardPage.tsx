import { useProfiles } from "../features/profile/useProfiles";
import type { WizardStep } from "../types/profile";

const ALL_STEPS: WizardStep[] = [
  "basics",
  "feeding",
  "routine",
  "favorites",
  "medical",
  "notes",
];

export default function DashboardPage() {
  const { profiles, createProfile, deleteProfile } = useProfiles();

  return (
    <main>
      <button onClick={() => createProfile()}>+ New Profile</button>
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
                <button>Edit</button>
                {isComplete ? (
                  <button>Generate PDF</button>
                ) : (
                  <button>Continue</button>
                )}
                <button onClick={() => deleteProfile(profile.id)}>
                  Delete
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
