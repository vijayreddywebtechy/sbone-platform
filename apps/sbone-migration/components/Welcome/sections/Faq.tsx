'use client';

import { useState } from 'react';
import { AccordionSection } from '@sbone/shared';
import styles from './Faq.module.scss';

const QUESTIONS = [
  {
    question: 'What is the SBOne?',
    answer:
      'SBOne is Standard Bank’s business hub that brings our most popular business banking services together in one convenient place. We are releasing key functionality periodically until the official launch.',
  },
  {
    question: 'How do I sign in or register for the SBOne?',
    answer:
      'Existing Online Banking for Business App users sign in with their usual username and password. New clients can register a profile, and invited users can follow the link in their invite. Select “Enroll to SBOne” to begin.',
  },
  {
    question: 'How can I get updates on new solutions?',
    answer: 'Select “Subscribe now” under Stay informed to receive updates on our latest solutions and features.',
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className={styles.section} aria-labelledby="faq-title">
      <div className={styles.inner}>
        <h2 id="faq-title" className={styles.title}>
          Frequently asked questions
        </h2>
        <div className={styles.list}>
          {QUESTIONS.map((item, index) => (
            <AccordionSection
              key={item.question}
              title={item.question}
              open={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <p className={styles.answer}>{item.answer}</p>
            </AccordionSection>
          ))}
        </div>
      </div>
    </section>
  );
}
