import styles from './Footer.module.scss';

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterProps {
  links?: FooterLink[];
  copyright?: string;
}

export function Footer({ links = [], copyright = `© ${new Date().getFullYear()} SBOne` }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <span className={styles.copyright}>{copyright}</span>
      {links.length > 0 && (
        <ul className={styles.links}>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={styles.link}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </footer>
  );
}
