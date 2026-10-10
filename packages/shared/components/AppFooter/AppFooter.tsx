import { cx } from '../../utils/classNames';
import type { FooterLink } from '../Footer/Footer';
import styles from './AppFooter.module.scss';

const DEFAULT_LINKS: FooterLink[] = [
  { label: 'Security centre', href: '#security-centre' },
  { label: 'Regulatory', href: '#regulatory' },
  { label: 'Legal', href: '#legal' },
  { label: 'Terms and conditions', href: '#terms-and-conditions' },
];

const DEFAULT_DISCLAIMER =
  'Standard Bank is a licensed financial services provider in terms of the Financial Advisory and Intermediary Services Act and a registered credit provider in terms of the National Credit Act, registration number NCRCP15';

export interface AppFooterProps {
  links?: FooterLink[];
  disclaimer?: string;
  className?: string;
}

/** Navy footer of the application flow screens: legal links and the regulatory disclaimer. */
export function AppFooter({ links = DEFAULT_LINKS, disclaimer = DEFAULT_DISCLAIMER, className }: AppFooterProps) {
  return (
    <footer className={cx(styles.footer, className)}>
      <div className={styles.inner}>
        {links.length > 0 && (
          <nav aria-label="Legal">
            <ul className={styles.links}>
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={styles.link}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
        <p className={styles.disclaimer}>{disclaimer}</p>
      </div>
    </footer>
  );
}
