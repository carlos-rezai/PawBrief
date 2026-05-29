import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProfile, useProfiles } from "../../features/profile";
import {
  BasicsStep,
  FeedingStep,
  FavoritesStep,
  MedicalStep,
  NotesStep,
  RoutineStep,
} from "../../features/wizard";
import type { StepData, WizardStep } from "../../types/profile";

const STEP_ORDER: WizardStep[] = [
  "basics",
  "feeding",
  "routine",
  "favorites",
  "medical",
  "notes",
];

export default function WizardPage() {
  const { id, step } = useParams<{ id: string; step: string }>();
  const navigate = useNavigate();
  const { createProfile } = useProfiles();
  const { profile, loading, saveStep } = useProfile(
    id === "new" || !id ? "" : id
  );

  useEffect(() => {
    if (id === "new" || !id) {
      createProfile().then((newId) => {
        navigate(`/wizard/${newId}/step/basics`, { replace: true });
      });
    }
  }, [id, createProfile, navigate]);

  if (id === "new" || !id || loading) return null;

  const currentStep = step as WizardStep;
  const stepIndex = STEP_ORDER.indexOf(currentStep);
  const prevStep = stepIndex > 0 ? STEP_ORDER[stepIndex - 1] : null;
  const nextStep =
    stepIndex < STEP_ORDER.length - 1 ? STEP_ORDER[stepIndex + 1] : null;

  const onSave = async (data: StepData) => {
    await saveStep(currentStep, data);
    if (nextStep) {
      navigate(`/wizard/${id}/step/${nextStep}`);
    } else {
      navigate(`/preview/${id}`);
    }
  };

  const onBack = prevStep
    ? () => navigate(`/wizard/${id}/step/${prevStep}`)
    : undefined;

  if (currentStep === "basics") {
    return (
      <main>
        <BasicsStep
          initialData={profile?.basics}
          onSave={onSave}
          onBack={onBack}
        />
      </main>
    );
  }

  if (currentStep === "feeding") {
    return (
      <main>
        <FeedingStep
          initialData={profile?.feeding}
          onSave={onSave}
          onBack={onBack}
        />
      </main>
    );
  }

  if (currentStep === "routine") {
    return (
      <main>
        <RoutineStep
          initialData={profile?.routine}
          onSave={onSave}
          onBack={onBack}
        />
      </main>
    );
  }

  if (currentStep === "favorites") {
    return (
      <main>
        <FavoritesStep
          initialData={profile?.favorites}
          onSave={onSave}
          onBack={onBack}
        />
      </main>
    );
  }

  if (currentStep === "medical") {
    return (
      <main>
        <MedicalStep
          initialData={profile?.medical}
          onSave={onSave}
          onBack={onBack}
        />
      </main>
    );
  }

  if (currentStep === "notes") {
    return (
      <main>
        <NotesStep
          initialData={profile?.notes}
          onSave={onSave}
          onBack={onBack}
        />
      </main>
    );
  }

  return <main>Wizard</main>;
}
