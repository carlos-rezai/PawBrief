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
import Header from "../../components/Header/Header";
import { useToast } from "../../components/Toast/Toast";
import type { StepData, WizardStep } from "../../types/profile";
import {
  STEP_ORDER,
  STEP_LABELS,
  STEP_SUBTITLES,
} from "../../utils/wizardSteps";
import { IconArrowLeft, IconArrowRight } from "../../primitives/icons";
import Mark from "../../primitives/Mark/Mark";
import {
  WizMain,
  WizStepEyebrow,
  WizStepCard,
  WizStepCardHeader,
  WizStepCardTitle,
  WizStepCardSubtitle,
  SuccessContent,
  SuccessTitle,
  SuccessBody,
} from "./WizardPage.styles";

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

  const handleBack = () => {
    if (stepIndex === 0) {
      navigate("/");
    } else if (prevStep) {
      navigate(`/wizard/${id}/step/${prevStep}`);
    }
  };

  const backLabel =
    stepIndex === 0 ? (
      "Cancel"
    ) : (
      <>
        <IconArrowLeft size={15} /> Back
      </>
    );

  const submitLabel = nextStep ? (
    <>
      Next: {STEP_LABELS[nextStep]} <IconArrowRight size={15} />
    </>
  ) : (
    "Finish & save"
  );

  function handleStepClick(index: number) {
    if (isEditMode) {
      navigate(`/wizard/${id}/step/${STEP_ORDER[index]}`);
    }
  }

  return (
    <>
      <Header />
      <WizMain>
        <Stepper currentStep={stepIndex} onStepClick={handleStepClick} />
        <WizStepEyebrow>STEP {stepIndex + 1} OF 6</WizStepEyebrow>
        <WizStepCard>
          <WizStepCardHeader>
            <WizStepCardTitle>{STEP_LABELS[currentStep]}</WizStepCardTitle>
            <WizStepCardSubtitle>
              {STEP_SUBTITLES[currentStep]}
            </WizStepCardSubtitle>
          </WizStepCardHeader>
          {currentStep === "basics" && (
            <BasicsStep
              initialData={profile?.basics}
              onSave={onSave}
              onBack={handleBack}
              backLabel={backLabel}
              submitLabel={submitLabel}
            />
          )}
          {currentStep === "feeding" && (
            <FeedingStep
              initialData={profile?.feeding}
              onSave={onSave}
              onBack={handleBack}
              backLabel={backLabel}
              submitLabel={submitLabel}
            />
          )}
          {currentStep === "routine" && (
            <RoutineStep
              initialData={profile?.routine}
              onSave={onSave}
              onBack={handleBack}
              backLabel={backLabel}
              submitLabel={submitLabel}
            />
          )}
          {currentStep === "favorites" && (
            <FavoritesStep
              initialData={profile?.favorites}
              onSave={onSave}
              onBack={handleBack}
              backLabel={backLabel}
              submitLabel={submitLabel}
            />
          )}
          {currentStep === "medical" && (
            <MedicalStep
              initialData={profile?.medical}
              onSave={onSave}
              onBack={handleBack}
              backLabel={backLabel}
              submitLabel={submitLabel}
            />
          )}
          {currentStep === "notes" && (
            <NotesStep
              initialData={profile?.notes}
              onSave={onSave}
              onBack={handleBack}
              backLabel={backLabel}
              submitLabel={submitLabel}
            />
          )}
        </WizStepCard>
      </WizMain>
      {showSuccess && (
        <Modal
          onClose={() => {
            setShowSuccess(false);
            navigate("/");
          }}
        >
          <SuccessContent>
            <Mark size={52} />
            <SuccessTitle>Your guide is ready!</SuccessTitle>
            <SuccessBody>
              {profile?.basics?.name
                ? `${profile.basics.name}'s care guide has been saved.`
                : "Your care guide has been saved."}
            </SuccessBody>
            <Button
              kind="primary"
              style={{ marginTop: 28, width: "100%" }}
              onClick={() => {
                setShowSuccess(false);
                navigate("/");
              }}
            >
              Done
            </Button>
          </SuccessContent>
        </Modal>
      )}
    </>
  );
}
