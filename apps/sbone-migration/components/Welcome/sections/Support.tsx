import { Button } from '@sbone/shared';
import styles from './Support.module.scss';

const CARDS = [
  { title: 'Help & support', text: 'We’re here to help with your questions or queries', action: 'Give us a call' },
  { title: 'Stay informed', text: 'Keep up to date with our latest solutions and more', action: 'Subscribe now' },
];

export function Support() {
  return (
    <section id="support" className={styles.section} aria-labelledby="support-title">
      <div className={styles.inner}>
        <h2 id="support-title" className={styles.title}>
          Reach out to us for additional support
        </h2>
        <ul className={styles.cards}>
          {CARDS.map((card) => (
            <li key={card.title} className={styles.card}>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardText}>{card.text}</p>
              <Button variant="secondary" size="sm" fullWidth>
                {card.action}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
