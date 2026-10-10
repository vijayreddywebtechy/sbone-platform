import { StoreBadges } from '../StoreBadges/StoreBadges';
import styles from './Footer.module.scss';

interface ContactLine {
  label: string;
  value: string;
  href: string;
}

const CONTACTS: Array<{ title: string; lines: ContactLine[] }> = [
  {
    title: 'Lost or stolen cards',
    lines: [
      { label: 'Local', value: '0800 020 600', href: 'tel:0800020600' },
      { label: 'International', value: '+27 10 824 1515', href: 'tel:+27108241515' },
    ],
  },
  {
    title: 'Get in touch',
    lines: [
      { label: 'Local', value: '0860 123 000', href: 'tel:0860123000' },
      { label: 'International', value: '+27 10 824 1515', href: 'tel:+27108241515' },
    ],
  },
  {
    title: 'Report unethical behaviour',
    lines: [
      { label: 'Local', value: '0800 020 600', href: 'tel:0800020600' },
      { label: 'Email', value: 'whistleblowingline@tip-offs.com', href: 'mailto:whistleblowingline@tip-offs.com' },
    ],
  },
  {
    title: 'Report a fraud incident',
    lines: [
      { label: 'Local', value: '0800 222 050', href: 'tel:0800222050' },
      { label: 'International', value: '+27 10 824 1515', href: 'tel:+27108241515' },
      { label: 'Email', value: 'Reportfraud@standardbank.co.za', href: 'mailto:Reportfraud@standardbank.co.za' },
    ],
  },
];

const LINK_GROUPS = [
  { title: 'SBOne', links: ['Regulatory', 'Conditions of access', 'Security centre', 'Privacy statement'] },
  { title: 'Get to know us', links: ['Standard Bank Group', 'Investor relations', 'Who we sponsor'] },
  { title: 'Report unethical behaviour', links: ['Click here for more information about unethical behaviour'] },
  { title: 'Compliments or complaints', links: ['Give us a call', 'Contact us'] },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <section className={styles.connect} aria-labelledby="connect-title">
        <div className={styles.inner}>
          <h2 id="connect-title" className={styles.connectTitle}>
            Connect with us
          </h2>
          <div className={styles.contacts}>
            {CONTACTS.map((group) => (
              <div key={group.title}>
                <h3 className={styles.contactTitle}>{group.title}</h3>
                <dl className={styles.contactList}>
                  {group.lines.map((line) => (
                    <div key={line.label} className={styles.contactLine}>
                      <dt>{line.label}</dt>
                      <dd>
                        <a href={line.href}>{line.value}</a>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.links}>
        <div className={styles.inner}>
          <div className={styles.linkGroups}>
            {LINK_GROUPS.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h3 className={styles.linkTitle}>{group.title}</h3>
                <ul className={styles.linkList}>
                  {group.links.map((link) => (
                    <li key={link}>
                      <a href="#" className={styles.link}>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.legal}>
        <div className={styles.inner}>
          <div className={styles.appRow}>
            <span className={styles.appTitle}>Standard Bank App</span>
            <StoreBadges includeAppGallery />
          </div>
          <p className={styles.disclaimer}>
            Standard Bank is a licensed financial services provider in terms of the Financial Advisory and Intermediary
            Services Act and registered credit provider in terms of the National Credit Act, registration number
            NCRCP15.
          </p>
        </div>
      </div>
    </footer>
  );
}
