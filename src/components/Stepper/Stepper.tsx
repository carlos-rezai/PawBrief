import { Fragment } from "react";
import {
  StepButton,
  StepCircle,
  StepConnector,
  StepLabel,
  StepperNav,
} from "./Stepper.styles";

const STEPS = ["Basics", "Feeding", "Routine", "Favorites", "Medical", "Notes"];

interface StepperProps {
  currentStep: number;
  onStepClick: (index: number) => void;
}

export default function Stepper({ currentStep, onStepClick }: StepperProps) {
  return (
    <StepperNav>
      {STEPS.map((label, index) => {
        const done = index < currentStep;
        const active = index === currentStep;
        return (
          <Fragment key={label}>
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
            {index < STEPS.length - 1 && (
              <StepConnector $done={done} aria-hidden="true" />
            )}
          </Fragment>
        );
      })}
    </StepperNav>
  );
}
