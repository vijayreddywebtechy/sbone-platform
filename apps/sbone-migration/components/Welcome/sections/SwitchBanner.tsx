import Image from 'next/image';
import { Button } from '@sbone/shared';
import styles from './SwitchBanner.module.scss';

export function SwitchBanner() {
  return (
    <section className={styles.section} aria-labelledby="switch-title">
      <div className={styles.content}>
        <h2 id="switch-title" className={styles.title}>
          Ready to move to Standard Bank?
        </h2>
        <p className={styles.text}>
          We’re serious about where your business is going. Discover why we’re the trusted choice when it comes to
          business banking.
        </p>
        <Button variant="inverse">Switch now</Button>
      </div>
      <div className={styles.media}>
        <Image src="/images/welcome/switch.svg" alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className={styles.image} />
      </div>
    </section>
  );
}
