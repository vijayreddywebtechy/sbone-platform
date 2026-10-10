import Link from 'next/link';
import { cx } from '../../utils/classNames';
import { Logo } from '../Logo/Logo';
import styles from './AppHeader.module.scss';

export interface AppHeaderProps {
  /** Where the close (×) button leads, e.g. back to the welcome page. Omit to hide the button. */
  closeHref?: string;
  /** Accessible name for the close button. */
  closeLabel?: string;
  className?: string;
}

/** Brand-blue bar of the application flow screens: Standard Bank logo and a close (×) button. */
export function AppHeader({ closeHref, closeLabel = 'Close', className }: AppHeaderProps) {
  return (
    <header className={cx(styles.header, className)}>
      <Logo size={28} />
      {closeHref && (
        // Link: returns without reloading the whole app
        <Link href={closeHref} className={styles.close} aria-label={closeLabel}>
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 5l14 14M19 5 5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </Link>
      )}
    </header>
  );
}
