'use client';

import { useState } from 'react';
import { Button, Collapse, cx, Panel, SearchBox, TextField, Toolbar } from '@sbone/shared';
import { useRouter } from 'next/navigation';
import { rememberFlowStep, useStepBack } from '@/lib/stepNavigation';
import { useTeam } from '../RolesPermissions/TeamContext';
import { useInvite } from './InviteContext';
import { InviteFrame } from './InviteFrame';
import { DIRECTORS, type Invitee } from './inviteData';
import styles from './SelectUsers.module.scss';

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

/** Step 2 of inviting team members: pick the directors/related parties to invite, with an optional job title. */
export function SelectUsers({ people = DIRECTORS }: { people?: Invitee[] }) {
  const goBack = useStepBack('/roles-permissions/invite');
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { selectedIds, jobTitles, toggleSelected, setJobTitle } = useInvite();
  const { isOnTeam } = useTeam();
  const selected = new Set(selectedIds);

  const term = query.trim().toLowerCase();
  const visible = people.filter(
    (person) =>
      !term || `${person.name} ${person.email} ${person.businessRoles.join(' ')}`.toLowerCase().includes(term),
  );

  const toggle = toggleSelected;

  const goNext = () => {
    const next = '/roles-permissions/invite/access';
    rememberFlowStep(next);
    router.push(next);
  };

  return (
    <InviteFrame
      currentStep={1}
      title="Select users"
      subtitle="Select who you’d like to invite from registered directors or related parties"
      actions={
        <>
          <Button variant="text" onClick={goBack}>
            Back
          </Button>
          <Button variant="secondary" disabled={selected.size === 0} onClick={goNext}>
            Next
          </Button>
        </>
      }
    >
      <Panel
        title="Directors & related parties"
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="8" r="3.5" />
            <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.3c2.1.7 3.5 2.8 3.5 5.7" />
          </svg>
        }
      >
        <Toolbar
          start={
            <span className={styles.counts} aria-live="polite">
              {visible.length} of {people.length} available · <span className={styles.selectedCount}>{selected.size} selected</span>
            </span>
          }
          end={
            <SearchBox
              label="Search directors and related parties"
              placeholder="Search directors and related parties"
              value={query}
              onChange={setQuery}
            />
          }
        />

        {visible.length === 0 ? (
          <p className={styles.empty}>No directors or related parties match your search.</p>
        ) : (
          <ul className={styles.people}>
            {visible.map((person) => {
              const isSelected = selected.has(person.id);
              // Already invited or active: can't be invited again
              const onTeam = isOnTeam(person.email);
              return (
                <li key={person.id} className={cx(styles.person, isSelected && styles.personSelected, onTeam && styles.personOnTeam)}>
                  {/* The whole row header toggles the person; the job title field sits outside the label */}
                  <label className={styles.header}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={isSelected}
                      disabled={onTeam}
                      onChange={() => toggle(person.id)}
                      aria-label={onTeam ? `${person.name} is already on the team` : `Invite ${person.name}`}
                    />
                    <span className={styles.identity}>
                      <span className={styles.avatar} aria-hidden="true">
                        {initials(person.name)}
                      </span>
                      <span className={styles.stack}>
                        <span className={styles.name}>
                          {person.name}
                          {onTeam && <span className={styles.onTeam}>Already on the team</span>}
                        </span>
                        <span className={styles.detail}>{person.email}</span>
                      </span>
                    </span>
                    <span className={styles.stack}>
                      <span className={styles.label}>Mobile</span>
                      <span className={styles.detail}>{person.mobile}</span>
                    </span>
                    <span className={styles.stack}>
                      <span className={styles.label}>Current business roles</span>
                      <span className={styles.detail}>{person.businessRoles.join(', ')}</span>
                    </span>
                    <span className={styles.tick} aria-hidden="true">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m5 12.5 4.5 4.5L19 7.5" />
                      </svg>
                    </span>
                  </label>

                  <Collapse open={isSelected}>
                    {/* Padding keeps the label that sits on the field's top border inside the animated area */}
                    <div className={styles.jobTitleWrap}>
                      <TextField
                        variant="floating"
                        label="Job Title"
                        hint="Add a custom job title for easy referencing"
                        autoComplete="off"
                        className={styles.jobTitle}
                        value={jobTitles[person.id] ?? ''}
                        onChange={(event) => setJobTitle(person.id, event.target.value)}
                      />
                    </div>
                  </Collapse>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
    </InviteFrame>
  );
}
