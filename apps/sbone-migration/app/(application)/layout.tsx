import { AppFooter, AppHeader, MiniHeader } from '@sbone/shared';
import styles from './layout.module.scss';

// Chrome shared by the application flow screens (business linking, identity verification, ...)
export default function ApplicationLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.app}>
      <MiniHeader />
      <AppHeader closeHref="/" closeLabel="Close and return to the welcome page" />
      <main className={styles.main}>{children}</main>
      <AppFooter />
    </div>
  );
}
