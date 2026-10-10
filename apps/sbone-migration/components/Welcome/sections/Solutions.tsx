import Image from 'next/image';
import { Button } from '@sbone/shared';
import styles from './Solutions.module.scss';

export function Solutions() {
  return (
    <section className={styles.section} aria-labelledby="solutions-title">
      <div className={styles.content}>
        <h2 id="solutions-title" className={styles.title}>
          Boost your business with reliable solutions
        </h2>
        <p className={styles.text}>
          Explore our wide range of financial offerings and solutions tailored to meet your unique needs.
        </p>
        <Button variant="secondary">Explore solutions</Button>
      </div>
      <div className={styles.media}>
        <Image src="/images/welcome/solutions.svg" alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className={styles.image} />
      </div>
    </section>
  );
}
