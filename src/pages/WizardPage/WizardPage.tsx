import { useEffect, useState } from "react";
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
import Stepper from "../../components/Stepper/Stepper";
import Modal from "../../primitives/Modal/Modal";
import Button from "../../primitives/Button/Button";
import { useToast } from "../../components/Toast/Toast";
import type { StepData, WizardStep } from "../../types/profile";
import { STEP_ORDER, STEP_LABELS } from "../../utils/wizardSteps";

export default function WizardPage() {
  const { id, step } = useParams<{ id: string; step: string }>();
  const navigate = useNavigate();
  const { enqueue } = useToast();
  const { createProfile } = useProfiles();
  const { profile, loading, saveStep } = useProfile(
    id === "new" || !id ? "" : id
  );
  const [showSuccess, setShowSuccess] = useState(false);

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
  const isEditMode = (profile?.completedSteps.length ?? 0) > 0;

  const onSave = async (data: StepData) => {
    await saveStep(currentStep, data);
    enqueue("Draft saved");
    if (nextStep) {
      navigate(`/wizard/${id}/step/${nextStep}`);
    } else {
      setShowSuccess(true);
    }
  };

  const onBack = prevStep
    ? () => navigate(`/wizard/${id}/step/${prevStep}`)
    : undefined;

  function handleStepClick(index: number) {
    if (isEditMode) {
      navigate(`/wizard/${id}/step/${STEP_ORDER[index]}`);
    }
  }

  return (
    <>
      <Stepper currentStep={stepIndex} onStepClick={handleStepClick} />
      <main>
        <h2>{STEP_LABELS[currentStep]}</h2>
        {currentStep === "basics" && (
          <BasicsStep
            initialData={profile?.basics}
            onSave={onSave}
            onBack={onBack}
          />
        )}
        {currentStep === "feeding" && (
          <FeedingStep
            initialData={profile?.feeding}
            onSave={onSave}
            onBack={onBack}
          />
        )}
        {currentStep === "routine" && (
          <RoutineStep
            initialData={profile?.routine}
            onSave={onSave}
            onBack={onBack}
          />
        )}
        {currentStep === "favorites" && (
          <FavoritesStep
            initialData={profile?.favorites}
            onSave={onSave}
            onBack={onBack}
          />
        )}
        {currentStep === "medical" && (
          <MedicalStep
            initialData={profile?.medical}
            onSave={onSave}
            onBack={onBack}
          />
        )}
        {currentStep === "notes" && (
          <NotesStep
            initialData={profile?.notes}
            onSave={onSave}
            onBack={onBack}
            submitLabel="Finish"
          />
        )}
      </main>
      {showSuccess && (
        <Modal
          onClose={() => {
            setShowSuccess(false);
            navigate("/");
          }}
        >
          <p>Your guide is ready!</p>
          <Button
            onClick={() => {
              setShowSuccess(false);
              navigate("/");
            }}
          >
            Done
          </Button>
        </Modal>
      )}
    </>
  );
}
