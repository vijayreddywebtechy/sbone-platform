'use client';

import { useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '@sbone/shared';
import { ApprovalIcon, PersonaliseIcon, SignInIcon } from '../icons';
import styles from './GetStarted.module.scss';

interface Step {
  title: string;
  text: string;
  icon: ReactNode;
}

// Only the "existing client" journey is defined in the design; the other two tabs reuse its
// last two steps until their copy is supplied.
const APPROVAL_STEP: Step = {
  title: 'Get your access approved',
  text: 'Next, you will need to link your business. You will request access to the platform from a list of known directors, related parties or business representatives. We will verify their details and send them an approval invite.',
  icon: <ApprovalIcon />,
};

const PERSONALISE_STEP: Step = {
  title: 'Personalise your experience',
  text: 'Once your access and roles & permissions are approved, you’ll be able to access your business dashboard and complete the recommended next best actions.',
  icon: <PersonaliseIcon />,
};

const JOURNEYS: Array<{ id: string; label: string; steps: Step[] }> = [
  {
    id: 'existing',
    label: 'Existing client using the business banking app',
    steps: [
      {
        title: 'Sign in with your banking app',
        text: 'As an existing customer currently using the Online Banking for Business App, simply sign in using the same username and password. Authenticate yourself, then select the business profile you would like to access.',
        icon: <SignInIcon />,
      },
      APPROVAL_STEP,
      PERSONALISE_STEP,
    ],
  },
  {
    id: 'new',
    label: 'New client not using the banking app',
    steps: [
      {
        title: 'Register your profile',
        text: 'Create your SBOne login with your personal details, then verify your identity to continue.',
        icon: <SignInIcon />,
      },
      APPROVAL_STEP,
      PERSONALISE_STEP,
    ],
  },
  {
    id: 'invite',
    label: 'I received an invite',
    steps: [
      {
        title: 'Accept your invite',
        text: 'Open the invite sent to you by your business admin, sign in or register, and verify your identity.',
        icon: <SignInIcon />,
      },
      { ...APPROVAL_STEP, text: 'Your business admin will confirm your roles & permissions before you can access the business profile.' },
      PERSONALISE_STEP,
    ],
  },
];

export function GetStarted() {
  const [activeJourney, setActiveJourney] = useState(0);
  const [activeStep, setActiveStep] = useState(1);
  const journey = JOURNEYS[activeJourney];

  const selectJourney = (index: number) => {
    setActiveJourney(index);
    document.getElementById(`journey-tab-${JOURNEYS[index].id}`)?.focus();
  };

  // Arrow keys move between tabs (WAI-ARIA tabs pattern)
  const onTabKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight') selectJourney((activeJourney + 1) % JOURNEYS.length);
    if (event.key === 'ArrowLeft') selectJourney((activeJourney - 1 + JOURNEYS.length) % JOURNEYS.length);
  };

  return (
    <section id="get-started" className={styles.section} aria-labelledby="get-started-title">
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 id="get-started-title" className={styles.title}>
            Get started in a few easy steps
          </h2>
          <p className={styles.intro}>We’ve simplified access to SBOne</p>
        </header>

        <div role="tablist" aria-label="Your situation" className={styles.tabs} onKeyDown={onTabKeyDown}>
          {JOURNEYS.map((item, index) => {
            const selected = index === activeJourney;
            return (
              <button
                key={item.id}
                id={`journey-tab-${item.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="journey-panel"
                tabIndex={selected ? 0 : -1}
                className={cx(styles.tab, selected && styles.tabSelected)}
                onClick={() => setActiveJourney(index)}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <ol
          id="journey-panel"
          role="tabpanel"
          aria-labelledby={`journey-tab-${journey.id}`}
          className={styles.steps}
          onMouseLeave={() => setActiveStep(1)}
        >
          {journey.steps.map((step, index) => (
            <li
              key={step.title}
              className={cx(styles.step, index === activeStep && styles.stepActive)}
              onMouseEnter={() => setActiveStep(index)}
            >
              <span className={styles.stepIcon}>{step.icon}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepText}>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
