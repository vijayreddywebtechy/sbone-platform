import Image from 'next/image';
import { Button } from '@sbone/shared';
import styles from './Hero.module.scss';

export function Hero() {
  return (
    <section id="top" className={styles.hero} aria-labelledby="hero-title">
      <Image src="/images/welcome/hero.svg" alt="" fill priority className={styles.image} />
      <div className={styles.inner}>
        <h1 id="hero-title" className={styles.title}>
          We’re on a journey to bring our most popular business banking services onto one convenient business hub.
        </h1>
        <p className={styles.text}>
          We will be releasing key functionality periodically until we’re ready to launch officially. Try out our limited
          version now.
        </p>
        <Button variant="secondary">Enroll to SBOne</Button>
      </div>
    </section>
  );
}
