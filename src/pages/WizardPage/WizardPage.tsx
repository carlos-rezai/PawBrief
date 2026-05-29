import { useParams } from "react-router-dom";
import { useProfile } from "../../features/profile";
import {
  BasicsStep,
  FeedingStep,
  RoutineStep,
  FavoritesStep,
  MedicalStep,
  NotesStep,
} from "../../features/wizard";
import type { WizardStep } from "../../types/profile";

export default function WizardPage() {
  const { id, step } = useParams<{ id: string; step: string }>();
  const { profile, loading } = useProfile(id ?? "");

  if (loading) return null;

  const currentStep = step as WizardStep;

  if (currentStep === "basics") {
    return (
      <main>
        <BasicsStep initialData={profile?.basics} />
      </main>
    );
  }

  if (currentStep === "feeding") {
    return (
      <main>
        <FeedingStep initialData={profile?.feeding} />
      </main>
    );
  }

  if (currentStep === "routine") {
    return (
      <main>
        <RoutineStep initialData={profile?.routine} />
      </main>
    );
  }

  if (currentStep === "favorites") {
    return (
      <main>
        <FavoritesStep initialData={profile?.favorites} />
      </main>
    );
  }

  if (currentStep === "medical") {
    return (
      <main>
        <MedicalStep initialData={profile?.medical} />
      </main>
    );
  }

  if (currentStep === "notes") {
    return (
      <main>
        <NotesStep initialData={profile?.notes} />
      </main>
    );
  }

  return <main>Wizard</main>;
}
