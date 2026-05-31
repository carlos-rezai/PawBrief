import { Fragment } from "react";
import Button from "../../primitives/Button/Button";

const STEPS = ["Basics", "Feeding", "Routine", "Favorites", "Medical", "Notes"];

interface StepperProps {
  currentStep: number;
  onStepClick: (index: number) => void;
}

export default function Stepper({ currentStep, onStepClick }: StepperProps) {
  return (
    <nav style={{ display: "flex", alignItems: "flex-start", width: "100%" }}>
      {STEPS.map((label, index) => {
        const done = index < currentStep;
        const active = index === currentStep;
        return (
          <Fragment key={label}>
            <Button
              kind="ghost"
              aria-current={active ? "step" : undefined}
              onClick={() => onStepClick(index)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                padding: 0,
                flex: "0 0 auto",
              }}
            >
              <span aria-hidden="true">{done ? "✓" : index + 1}</span>
              <span>{label}</span>
            </Button>
            {index < STEPS.length - 1 && (
              <div
                aria-hidden="true"
                style={{
                  flex: 1,
                  height: 2,
                  alignSelf: "flex-start",
                  marginTop: 14,
                }}
              />
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
