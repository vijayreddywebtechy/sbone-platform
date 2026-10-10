'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cx } from '../../utils/classNames';
import { LegalFooter } from '../LegalFooter/LegalFooter';
import { Logo } from '../Logo/Logo';
import { ActiveCompanyProvider, useActiveCompany, type ShellCompany } from './ActiveCompany';
import { SBONE_NAV_ITEMS, ZONE_BASE_PATHS, type Zone } from './navigation';
import styles from './AppShell.module.scss';

const Icon = ({ children }: { children: ReactNode }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

const DEFAULT_FOOTER_LINKS = ['Conditions of access', 'Disclaimer', 'Privacy statement'];

export interface AppShellProps {
  userName: string;
  /** Businesses the user can switch between in the account menu */
  companies: ShellCompany[];
  defaultCompanyId: string;
  /** Zone (micro frontend) rendering the shell: decides which links stay in-app and which leave for another zone */
  zone?: Zone;
  footerLinks?: string[];
  children: ReactNode;
}

/**
 * Signed-in SBOne shell shared by every micro frontend: Standard Bank blue header with account menu and sign out,
 * icon side navigation and the navy footer. Links to pages in another zone are plain anchors (hard navigation),
 * as Next.js multi-zones require; links inside the zone are client-side.
 */
export function AppShell({ companies, defaultCompanyId, ...props }: AppShellProps) {
  return (
    <ActiveCompanyProvider companies={companies} defaultCompanyId={defaultCompanyId}>
      <Shell companies={companies} {...props} />
    </ActiveCompanyProvider>
  );
}

function Shell({ userName, companies, zone = 'main', footerLinks = DEFAULT_FOOTER_LINKS, children }: Omit<AppShellProps, 'defaultCompanyId'>) {
  const router = useRouter();
  const basePath = ZONE_BASE_PATHS[zone];
  // usePathname leaves out the zone's basePath; put it back to compare with the nav hrefs
  const pathname = `${basePath}${usePathname()}`.replace(/\/$/, '') || '/';
  const inZone = (target: Zone = 'main') => target === zone;
  // Path as this zone's router expects it (without its basePath)
  const local = (href: string) => href.slice(basePath.length) || '/';
  // Client-side inside the zone; a full page load into another zone
  const navigate = (href: string, target: Zone = 'main') => {
    if (inZone(target)) router.push(local(href));
    else window.location.assign(href);
  };
  const onSignOut = () => navigate('/');
  const [menuOpen, setMenuOpen] = useState(false);
  // The account menu shows either its main options or the list of companies to switch to
  const [menuView, setMenuView] = useState<'main' | 'companies'>('main');
  const menuRef = useRef<HTMLDivElement>(null);
  const { company, setCompanyId } = useActiveCompany();

  const closeMenu = () => {
    setMenuOpen(false);
    setMenuView('main');
  };

  // Close the user menu on outside click or Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onPointer = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
        setMenuView('main');
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        setMenuView('main');
      }
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);


  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Logo size={30} />

        <div className={styles.headerEnd}>
          <div className={styles.userMenu} ref={menuRef}>
            <button
              type="button"
              className={styles.userButton}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label={`${userName}, account menu`}
              onClick={() => (menuOpen ? closeMenu() : setMenuOpen(true))}
            >
              <span className={styles.avatar} aria-hidden="true">
                {userName
                  .split(/\s+/)
                  .map((part) => part[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
              <span className={styles.userText}>
                <span className={styles.userName}>{userName}</span>
                <span className={styles.userCompany}>{company.name}</span>
              </span>
              <svg className={cx(styles.caret, menuOpen && styles.caretOpen)} width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
                <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {menuOpen && menuView === 'main' && (
              <div className={styles.menu} role="menu" aria-label="Account">
                <button
                  type="button"
                  role="menuitem"
                  className={styles.menuItem}
                  onClick={() => setMenuView('companies')}
                >
                  Switch Business
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className={styles.menuItem}
                  onClick={() => {
                    closeMenu();
                    navigate('/my-profile');
                  }}
                >
                  My Profile
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className={styles.menuItem}
                  onClick={() => {
                    closeMenu();
                    navigate('/business-details');
                  }}
                >
                  Business Information
                </button>
              </div>
            )}
            {menuOpen && menuView === 'companies' && (
              <div className={cx(styles.menu, styles.companies)} role="menu" aria-label="Switch business">
                {companies.map((item) => {
                  const current = item.id === company.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="menuitemradio"
                      aria-checked={current}
                      autoFocus={current}
                      className={cx(styles.company, current && styles.companyCurrent)}
                      onClick={() => {
                        setCompanyId(item.id);
                        closeMenu();
                      }}
                    >
                      <Icon>
                        <circle cx="12" cy="8" r="3.5" />
                        <path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" />
                      </Icon>
                      <span className={styles.companyText}>
                        <span className={styles.companyName}>{item.name}</span>
                        <span className={styles.companyRole}>{item.role}</span>
                      </span>
                      {current && (
                        <Icon>
                          <path d="m5 12.5 4.5 4.5L19 7.5" />
                        </Icon>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button type="button" className={styles.signOutButton} onClick={onSignOut}>
            <Icon>
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0" />
            </Icon>
            <span className={styles.headerLabel}>Sign out</span>
          </button>
        </div>
      </header>

      <div className={styles.body}>
        {/* Icon-only rail; each item's name appears beside it on hover or keyboard focus */}
        <nav aria-label="SBOne" className={styles.sidebar}>
          <ul className={styles.nav}>
            {SBONE_NAV_ITEMS.map((item) => {
              const active = item.href !== undefined && pathname.startsWith(item.href);
              const content = (
                <>
                  {item.icon}
                  <span className={styles.tooltip} aria-hidden="true">
                    {item.label}
                  </span>
                </>
              );
              return (
                <li key={item.label}>
                  {item.href && inZone(item.zone) ? (
                    <Link
                      href={local(item.href)}
                      className={cx(styles.navItem, active && styles.navItemActive)}
                      aria-current={active ? 'page' : undefined}
                      aria-label={item.label}
                    >
                      {content}
                    </Link>
                  ) : item.href ? (
                    // Another zone: a plain link, so the browser loads that micro frontend
                    <a
                      href={item.href}
                      className={cx(styles.navItem, active && styles.navItemActive)}
                      aria-current={active ? 'page' : undefined}
                      aria-label={item.label}
                    >
                      {content}
                    </a>
                  ) : (
                    <button
                      type="button"
                      className={styles.navItem}
                      aria-disabled="true"
                      aria-label={`${item.label} (coming soon)`}
                    >
                      {content}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>

          <button type="button" className={cx(styles.navItem, styles.signOut)} onClick={onSignOut} aria-label="Sign Out">
            <Icon>
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0" />
            </Icon>
            <span className={styles.tooltip} aria-hidden="true">
              Sign Out
            </span>
          </button>
        </nav>

        <div className={styles.content}>
          <main className={styles.main}>{children}</main>
          <LegalFooter variant="navy" links={footerLinks} />
        </div>
      </div>
    </div>
  );
}
