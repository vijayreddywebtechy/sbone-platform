'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Collapse, cx, Panel, SearchBox, SelectableCard, Toolbar } from '@sbone/shared';
import { rememberFlowStep } from '@/lib/stepNavigation';
import { BUSINESS_PROFILES, type BusinessProfileSummary } from './businessProfiles';
import { FlowPage } from '../FlowPage/FlowPage';
import styles from './BusinessProfile.module.scss';

export interface BusinessProfileProps {
  profiles?: BusinessProfileSummary[];
  /** Called with the chosen business, or null when the selection is cleared. */
  onSelect?: (profile: BusinessProfileSummary | null) => void;
  onAddBusiness?: () => void;
}

export function BusinessProfile({ profiles = BUSINESS_PROFILES, onSelect, onAddBusiness }: BusinessProfileProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // Scroll indicator: thumb size = share of cards in view, offset = how far the carousel has scrolled (both 0–1)
  const [thumb, setThumb] = useState({ size: 1, offset: 0 });
  const trackRef = useRef<HTMLUListElement>(null);

  // Matches the name, or the registration number typed with or without slashes
  const matchesQuery = (profile: BusinessProfileSummary, text: string) => {
    const term = text.trim().toLowerCase();
    const digits = term.replace(/\D/g, '');
    return (
      !term ||
      profile.name.toLowerCase().includes(term) ||
      (digits !== '' && profile.registrationNumber.replace(/\D/g, '').includes(digits))
    );
  };
  const matches = profiles.filter((profile) => matchesQuery(profile, query));

  const selected = matches.find((profile) => profile.id === selectedId) ?? null;

  // A search that hides the selected card clears the selection, so the "can't see your business" prompt comes back
  // and the card isn't silently re-selected when the search is cleared
  const changeQuery = (text: string) => {
    setQuery(text);
    const current = profiles.find((profile) => profile.id === selectedId);
    if (current && !matchesQuery(current, text)) {
      setSelectedId(null);
      onSelect?.(null);
    }
  };

  // Clicking a card selects it; clicking the selected card again unticks it
  const toggle = (profile: BusinessProfileSummary) => {
    const next = profile.id === selected?.id ? null : profile;
    setSelectedId(next?.id ?? null);
    onSelect?.(next);
  };

  // NEXT continues to linking the selected business
  const goNext = () => {
    if (!selected) return;
    const path = `/business-linking/${selected.id}`;
    rememberFlowStep(path);
    router.push(path);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      if (track.scrollWidth === 0) return;
      setThumb({ size: track.clientWidth / track.scrollWidth, offset: track.scrollLeft / track.scrollWidth });
    };
    track.scrollTo?.({ left: 0 });
    measure();
    track.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      track.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, [matches.length]);

  return (
    <FlowPage
      title="Your Business Profile"
      subtitle="Please select the business you would like to apply for"
      actions={
        <Button variant="secondary" disabled={!selected} onClick={goNext}>
          Next
        </Button>
      }
    >
      <Panel
        title="Businesses"
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16M15 9h4a1 1 0 0 1 1 1v11M2.5 21h19M8 8h1M11 8h1M8 12h1M11 12h1M8 16h1M11 16h1" />
          </svg>
        }
      >
        <section aria-labelledby="business-profile-title">
          <h2 id="business-profile-title" className={styles.srOnly}>
            Businesses you can apply for
          </h2>
          <Toolbar
            start={
              <span className={styles.count} aria-live="polite">
                {matches.length} found
              </span>
            }
            end={<SearchBox label="Search by business name" placeholder="Search by business name" value={query} onChange={changeQuery} />}
          />

          {matches.length === 0 ? (
            <p className={styles.empty}>No businesses match “{query}”.</p>
          ) : (
            <>
              <ul ref={trackRef} className={styles.track} role="radiogroup" aria-labelledby="business-profile-title">
                {matches.map((profile) => (
                  <li key={profile.id} className={styles.slide}>
                    <SelectableCard selected={profile.id === selected?.id} className={styles.profile} onClick={() => toggle(profile)}>
                      <span className={styles.icon}>
                        <BuildingIcon />
                      </span>
                      <span className={styles.name}>{profile.name}</span>
                      <span className={styles.reg}>Reg. no: {profile.registrationNumber}</span>
                      <span className={styles.status}>
                        <span className={cx(styles.statusDot, profile.status === 'linked' ? styles.dotLinked : styles.dotOpen)} aria-hidden="true" />
                        {profile.status === 'linked' ? 'Linked' : 'Link now'}
                      </span>
                    </SelectableCard>
                  </li>
                ))}
              </ul>

              {/* Swipe or scroll the cards; keyboard focus scrolls each card into view */}
              {thumb.size < 0.99 && (
                <div className={styles.indicator} aria-hidden="true">
                  <span
                    className={styles.thumb}
                    style={{
                      width: `${thumb.size * 100}%`,
                      transform: `translateX(${(thumb.offset / thumb.size) * 100}%)`,
                    }}
                  />
                </div>
              )}
            </>
          )}
        </section>
      </Panel>

      <Collapse open={!selected}>
        <section className={styles.missing} aria-labelledby="missing-business-title">
          <span className={styles.missingText}>
            <h2 id="missing-business-title" className={styles.missingTitle}>
              Can’t see your registered business?
            </h2>
            <span className={styles.missingNote}>If your business isn’t listed, give us some details so we can assist.</span>
          </span>
          <Button variant="secondaryOutline" onClick={onAddBusiness}>
            Add business
          </Button>
        </section>
      </Collapse>
    </FlowPage>
  );
}

function BuildingIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M7 34V7h15v27M22 15h11v19M4 34h32" />
      <path d="M11 11h2M16 11h2M11 15h2M16 15h2M11 19h2M16 19h2M11 23h2M16 23h2M11 27h2M16 27h2M26 20h3M26 24h3M26 28h3" />
    </svg>
  );
}
