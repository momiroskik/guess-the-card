import { Fragment, memo } from 'react';

interface StepperProps {
  steps: readonly string[];
  current: number;
  detail?: string;
}

function StepperImpl({ steps, current, detail }: StepperProps) {
  return (
    <nav className="stepper" aria-label="Progress">
      <ol className="contents">
        {steps.map((step, index) => {
          const state = index < current ? 'done' : index === current ? 'current' : 'todo';

          return (
            <Fragment key={step}>
              {index > 0 && <span className="step-line" data-filled={index <= current} />}
              <li
                className="step"
                data-state={state}
                aria-current={state === 'current' ? 'step' : undefined}
              >
                <span className="step-dot" aria-hidden="true">
                  {state === 'done' ? '✓' : index + 1}
                </span>
                <span className="step-label">
                  {step}
                  {state === 'current' && detail ? (
                    <span className="step-detail">{detail}</span>
                  ) : null}
                </span>
                <span className="sr-only">
                  {`Step ${index + 1} of ${steps.length}: ${step}. ` +
                    (state === 'done' ? 'Completed.' : state === 'current' ? 'Current.' : 'Pending.')}
                </span>
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

export const Stepper = memo(StepperImpl);
