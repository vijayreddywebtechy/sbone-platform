'use client';

import { useCallback, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Alert, Button, CardsViewIcon, cx, FigureStrip, ListViewIcon, Modal, Panel, SearchBox, Segmented, Toast, Toolbar } from '@sbone/shared';
import { USER } from '../Dashboard/dashboardData';
import {
  MEMBER_DATE_LABELS,
  MEMBER_STATUSES,
  MEMBER_STATUS_LABELS,
  type MemberStatus,
  type TeamMember,
} from './teamMembers';
import { useTeam } from './TeamContext';
import styles from './RolesPermissions.module.scss';

type Filter = 'all' | MemberStatus;
type View = 'grid' | 'list';

/** Status colours for the figure dots and member status; the variables are set from shared tokens in the stylesheet */
const STATUS_COLORS: Record<MemberStatus, string> = {
  active: 'var(--status-active)',
  invited: 'var(--status-invited)',
  declined: 'var(--status-declined)',
  locked: 'var(--status-locked)',
};

const Icon = ({ children, size = 20 }: { children: ReactNode; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

/** Team members on this business profile, their roles and access status. */
export function RolesPermissions() {
  const router = useRouter();
  const { members, setStatus, remove } = useTeam();
  const [managingId, setManagingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const dismissToast = useCallback(() => setToast(null), []);
  const managing = members.find((member) => member.id === managingId) ?? null;
  // The signed-in user can't change their own access
  const isSelf = (member: TeamMember) => member.name === USER.name;

  const act = (message: string, change: () => void) => {
    change();
    setManagingId(null);
    setToast(message);
  };
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [view, setView] = useState<View>('grid');

  const count = (status: MemberStatus) => members.filter((member) => member.status === status).length;
  const term = query.trim().toLowerCase();
  const visible = members
    .filter((member) => filter === 'all' || member.status === filter)
    .filter((member) => !term || `${member.name} ${member.email} ${member.role}`.toLowerCase().includes(term));

  const status = (member: TeamMember) => (
    <span className={styles.status}>
      <span className={styles.statusDot} style={{ background: STATUS_COLORS[member.status] }} aria-hidden="true" />
      {MEMBER_STATUS_LABELS[member.status]}
    </span>
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/dashboard" className={styles.back} aria-label="Back to dashboard">
          <Icon>
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </Icon>
        </Link>
        <h1 className={styles.title}>Roles &amp; Permissions</h1>
        <Button variant="secondary" onClick={() => router.push('/roles-permissions/invite')}>
          <span className={styles.inviteLabel}>
            <Icon size={16}>
              <circle cx="10" cy="8" r="3.2" />
              <path d="M4 19c0-3.3 2.7-5.5 6-5.5 1.1 0 2.1.2 3 .7M17.5 14v6M14.5 17h6" />
            </Icon>
            Invite user
          </span>
        </Button>
      </header>

      <section className={styles.summary} aria-label="Team members by status">
        <FigureStrip
          figures={MEMBER_STATUSES.map((item) => ({
            label: MEMBER_STATUS_LABELS[item],
            value: count(item),
            dotColor: STATUS_COLORS[item],
            note: `of ${members.length} team member${members.length === 1 ? '' : 's'}`,
          }))}
        />
      </section>

      <Panel
        title="Team Members"
        icon={
          <Icon>
            <circle cx="9" cy="8" r="3.5" />
            <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.3c2.1.7 3.5 2.8 3.5 5.7" />
          </Icon>
        }
      >
        <Toolbar
          start={
            <Segmented
              label="Show team members"
              options={[
                { value: 'all' as Filter, label: 'All', count: members.length },
                ...MEMBER_STATUSES.map((item) => ({ value: item as Filter, label: MEMBER_STATUS_LABELS[item], count: count(item) })),
              ]}
              value={filter}
              onChange={setFilter}
            />
          }
          end={
            <>
              <SearchBox label="Search users" placeholder="Search users" value={query} onChange={setQuery} />
              <Segmented
                label="Layout"
                options={[
                  { value: 'grid' as View, label: 'Cards', icon: <CardsViewIcon /> },
                  { value: 'list' as View, label: 'List', icon: <ListViewIcon /> },
                ]}
                value={view}
                onChange={setView}
              />
            </>
          }
        />

        <p className={styles.srOnly} aria-live="polite">
          Showing {visible.length} of {members.length} team members
        </p>

        {visible.length === 0 ? (
          <p className={styles.empty}>
            {term ? 'No team members match your search.' : `No ${MEMBER_STATUS_LABELS[filter as MemberStatus].toLowerCase()} team members.`}
          </p>
        ) : view === 'grid' ? (
          <ul className={styles.grid}>
            {visible.map((member) => (
              <li key={member.id} className={styles.card}>
                <span className={styles.person}>
                  <span className={styles.avatar} aria-hidden="true">
                    {initials(member.name)}
                  </span>
                  <span className={styles.identity}>
                    <span className={styles.name}>{member.name}</span>
                    <span className={styles.email}>{member.email}</span>
                  </span>
                  {status(member)}
                </span>
                <dl className={styles.facts}>
                  <div>
                    <dt>Role</dt>
                    <dd>
                      {member.role}
                      {member.jobTitle && <span className={styles.jobTitle}> · {member.jobTitle}</span>}
                    </dd>
                  </div>
                  <div>
                    <dt>{MEMBER_DATE_LABELS[member.status]}</dt>
                    <dd>{member.date}</dd>
                  </div>
                </dl>
                <Button
                  variant="secondaryOutline"
                  size="sm"
                  className={styles.manage}
                  aria-label={`Manage ${member.name}`}
                  onClick={() => setManagingId(member.id)}
                >
                  Manage
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Team member</th>
                  <th scope="col" className={styles.wideOnly}>
                    Role
                  </th>
                  <th scope="col" className={styles.wideOnly}>
                    Date
                  </th>
                  <th scope="col">Status</th>
                  <th scope="col">
                    <span className={styles.srOnly}>Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((member) => (
                  <tr key={member.id}>
                    <td>
                      <span className={styles.person}>
                        <span className={styles.avatar} aria-hidden="true">
                          {initials(member.name)}
                        </span>
                        <span className={styles.identity}>
                          <span className={styles.name}>{member.name}</span>
                          <span className={styles.email}>{member.email}</span>
                        </span>
                      </span>
                    </td>
                    <td className={styles.wideOnly}>{member.role}</td>
                    <td className={cx(styles.muted, styles.wideOnly)}>
                      {MEMBER_DATE_LABELS[member.status]} {member.date}
                    </td>
                    <td>{status(member)}</td>
                    <td className={styles.actionsCell}>
                      <Button variant="secondaryOutline" size="sm" aria-label={`Manage ${member.name}`} onClick={() => setManagingId(member.id)}>
                        Manage
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <Alert
        variant="neutral"
        icon={
          <Icon size={16}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5M12 8h.01" />
          </Icon>
        }
        className={styles.note}
      >
        Please note, the roles and permissions above are not shared across other business banking platforms.
      </Alert>

      <Modal
        open={managing !== null}
        title={managing ? `Manage ${managing.name}` : 'Manage'}
        onClose={() => setManagingId(null)}
        footer={
          managing &&
          !isSelf(managing) && (
            <div className={styles.modalActions}>
              {managing.status === 'invited' && (
                <>
                  <Button variant="text" onClick={() => act(`Invite for ${managing.name} cancelled`, () => remove(managing.id))}>
                    Cancel invite
                  </Button>
                  <Button variant="secondary" onClick={() => act(`Invite resent to ${managing.email}`, () => setStatus(managing.id, 'invited'))}>
                    Resend invite
                  </Button>
                </>
              )}
              {managing.status === 'active' && (
                <Button variant="secondaryOutline" onClick={() => act(`${managing.name}'s access is locked`, () => setStatus(managing.id, 'locked'))}>
                  Lock access
                </Button>
              )}
              {managing.status === 'locked' && (
                <Button variant="secondary" onClick={() => act(`${managing.name}'s access is unlocked`, () => setStatus(managing.id, 'active'))}>
                  Unlock access
                </Button>
              )}
              {managing.status === 'declined' && (
                <>
                  <Button variant="text" onClick={() => act(`${managing.name} removed`, () => remove(managing.id))}>
                    Remove
                  </Button>
                  <Button variant="secondary" onClick={() => act(`Invite sent to ${managing.email}`, () => setStatus(managing.id, 'invited'))}>
                    Invite again
                  </Button>
                </>
              )}
            </div>
          )
        }
      >
        {managing && (
          <div className={styles.manageBody}>
            <span className={styles.person}>
              <span className={styles.avatar} aria-hidden="true">
                {initials(managing.name)}
              </span>
              <span className={styles.identity}>
                <span className={styles.name}>{managing.name}</span>
                <span className={styles.email}>{managing.email}</span>
              </span>
              {status(managing)}
            </span>
            <dl className={styles.facts}>
              <div>
                <dt>Role</dt>
                <dd>{managing.role}</dd>
              </div>
              {managing.jobTitle && (
                <div>
                  <dt>Job title</dt>
                  <dd>{managing.jobTitle}</dd>
                </div>
              )}
              <div>
                <dt>{MEMBER_DATE_LABELS[managing.status]}</dt>
                <dd>{managing.date}</dd>
              </div>
            </dl>
            {isSelf(managing) && <p className={styles.selfNote}>This is your own profile. Another administrator has to change your access.</p>}
          </div>
        )}
      </Modal>

      {toast && <Toast message={toast} onDismiss={dismissToast} />}
    </div>
  );
}
