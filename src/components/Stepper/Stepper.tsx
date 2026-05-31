import { Fragment } from "react";
import {
  StepButton,
  StepCircle,
  StepConnector,
  StepLabel,
  StepperNav,
} from "./Stepper.styles";
import { STEP_ORDER, STEP_LABELS } from "../../utils/wizardSteps";

interface StepperProps {
  currentStep: number;
  onStepClick: (index: number) => void;
}

export default function Stepper({ currentStep, onStepClick }: StepperProps) {
  return (
    <StepperNav>
      {STEP_ORDER.map((step, index) => {
        const label = STEP_LABELS[step];
        const done = index < currentStep;
        const active = index === currentStep;
        return (
          <Fragment key={step}>
            <StepButton
              $done={done}
              $active={active}
              aria-current={active ? "step" : undefined}
              onClick={() => onStepClick(index)}
            >
              <StepCircle $done={done} $active={active} aria-hidden="true">
                {done ? "✓" : index + 1}
              </StepCircle>
              <StepLabel $active={active}>{label}</StepLabel>
            </StepButton>
            {index < STEP_ORDER.length - 1 && (
              <StepConnector $done={done} aria-hidden="true" />
            )}
          </Fragment>
        );
      })}
    </StepperNav>
  );
}
