import Image from 'next/image';
import { StoreBadges } from '@/components/StoreBadges/StoreBadges';
import styles from './AppDownload.module.scss';

export function AppDownload() {
  return (
    <section id="app-download" className={styles.section} aria-labelledby="app-download-title">
      <div className={styles.inner}>
        <Image
          src="/images/welcome/app-phone.svg"
          alt="The Standard Bank app sign-in screen"
          width={200}
          height={400}
          className={styles.phone}
        />

        <div className={styles.content}>
          <h2 id="app-download-title" className={styles.title}>
            Download it now to access SBOne
          </h2>
          <p className={styles.text}>
            Manage your banking, make payments and access your information and solutions anytime, anywhere.
          </p>
          <StoreBadges className={styles.badges} />
        </div>
      </div>
    </section>
  );
}
