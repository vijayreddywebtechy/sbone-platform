import { cx } from '../../utils/classNames';
import styles from './LegalFooter.module.scss';

const DEFAULT_LINKS = ['Security centre', 'Regulatory', 'Legal', 'Terms and conditions', 'Rates and pricing'];

export interface LegalFooterProps {
  /** navy = application flow screens, light = inside the signed-in dashboard. */
  variant?: 'navy' | 'light';
  links?: string[];
}

/** Footer with regulatory links and the FSP/NCR disclosure. */
export function LegalFooter({ variant = 'navy', links = DEFAULT_LINKS }: LegalFooterProps) {
  return (
    <footer className={cx(styles.footer, styles[variant])}>
      <div className={styles.inner}>
        <ul className={styles.links}>
          {links.map((link) => (
            <li key={link}>
              <a href="#" className={styles.link}>
                {link}
              </a>
            </li>
          ))}
        </ul>
        <p className={styles.legal}>
          Standard Bank is a licensed financial services provider in terms of the Financial Advisory and Intermediary
          Services Act and a registered credit provider in terms of the National Credit Act, registration number NCRCP15
        </p>
      </div>
    </footer>
  );
}
