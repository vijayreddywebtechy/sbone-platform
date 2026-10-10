import { cx } from '../../utils/classNames';
import styles from './Stepper.module.scss';

export interface StepperProps {
  steps: string[];
  /** Zero-based index of the step the user is on. */
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <nav aria-label="Progress" className={className}>
      <ol className={styles.stepper}>
        {steps.map((step, index) => {
          const status = index < currentStep ? 'complete' : index === currentStep ? 'current' : 'upcoming';
          return (
            <li
              key={step}
              className={cx(styles.step, styles[status])}
              aria-current={status === 'current' ? 'step' : undefined}
            >
              <span className={styles.marker}>{status === 'complete' ? '✓' : index + 1}</span>
              <span className={styles.label}>{step}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
