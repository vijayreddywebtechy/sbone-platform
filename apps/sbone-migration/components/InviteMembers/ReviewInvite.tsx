'use client';

import { useId } from 'react';
import Link from 'next/link';
import { Alert, Button, TextField, cx } from '@sbone/shared';
import { AccountIcon } from '@/components/AccountIcon/AccountIcon';
import { useRouter } from 'next/navigation';
import { useStepBack } from '@/lib/stepNavigation';
import {
  ACCESS_ROLES,
  INLINE_GROUPS,
  PERMISSION_SECTIONS,
  RELEASE_LEVELS,
  ROLE_RULES,
  type PermissionGroup,
} from './accessData';
import {
  ACCOUNT_GROUPS,
  INVITE_ACCOUNTS,
  LIMIT_COLUMNS,
  LIMIT_LABELS,
  formatLimit,
  type AccountKind,
} from './accountsData';
import { Block } from './Block';
import { useTeam } from '../RolesPermissions/TeamContext';
import { useInvite } from './InviteContext';
import { InviteFrame } from './InviteFrame';
import { DIRECTORS } from './inviteData';
import access from './ConfigureAccess.module.scss';
import accountStyles from './SelectAccounts.module.scss';
import styles from './ReviewInvite.module.scss';

const NOT_APPLICABLE = 'Not applicable for this role';

const ICON_TYPES: Record<AccountKind, 'current' | 'savings' | 'foreign'> = {
  current: 'current',
  savings: 'savings',
  cfc: 'foreign',
};

/** Grey tick for an included permission, faint cross for one that isn't. */
function Mark({ on }: { on: boolean }) {
  return (
    <span className={cx(styles.mark, on ? styles.markOn : styles.markOff)} aria-hidden="true">
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={on ? 'm5 12.5 4.5 4.5L19 7.5' : 'M7 7l10 10M17 7 7 17'} />
      </svg>
    </span>
  );
}

const nameParts = (name: string) => {
  const [first, ...rest] = name.split(/\s+/);
  return { first, surname: rest.join(' ') };
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

/** Step 5 of inviting team members: a read-only summary of every choice before the invite is sent. */
export function ReviewInvite() {
  const goBack = useStepBack('/roles-permissions/invite/accounts');
  const router = useRouter();
  const id = useId();
  const { selectedIds, jobTitles, role, permissions, releaseLevel, accountStates } = useInvite();
  const { invite } = useTeam();

  const rules = ROLE_RULES[role];
  const allowed = new Set(rules.allowed);
  const enabled = new Set(permissions);
  const roleTitle = ACCESS_ROLES.find((item) => item.value === role)?.title ?? '';
  const users = selectedIds
    .map((personId) => DIRECTORS.find((person) => person.id === personId))
    .filter((p) => p !== undefined);
  const accounts = INVITE_ACCOUNTS.filter((account) => accountStates[account.id]?.on);

  const groupIds = (group: PermissionGroup) => group.columns.flat().map((permission) => permission.id);
  const applies = (ids: string[]) => ids.some((permissionId) => allowed.has(permissionId));
  const selectedCount = (ids: string[]) => `${ids.filter((permissionId) => enabled.has(permissionId)).length} Selected`;

  return (
    <InviteFrame
      currentStep={4}
      title="Review and send invite"
      subtitle="Confirm permissions before sending invite"
      actions={
        <>
          <Button variant="text" onClick={goBack}>
            Back
          </Button>
          {/* Not connected to an API yet: the people are added to the team as Invited, then the confirmation shows */}
          <Button
            variant="secondary"
            disabled={users.length === 0 || accounts.length === 0}
            onClick={() => {
              invite(users.map((person) => ({ name: person.name, email: person.email, role: roleTitle, jobTitle: jobTitles[person.id]?.trim() || undefined })));
              router.replace('/roles-permissions/invite/sent');
            }}
          >
            Send invite
          </Button>
        </>
      }
    >
      {users.length === 0 && (
        <Alert variant="warning" className={styles.missing}>
          No users have been selected. <Link href="/roles-permissions/invite/users">Select users</Link> before sending
          the invite.
        </Alert>
      )}

      <Block title="Apply role to these users" summary={`${users.length} Selected`}>
        {users.length > 0 && (
          <div className={access.tableWrap}>
            <table className={access.table}>
              <thead>
                <tr>
                  <th scope="col">First name</th>
                  <th scope="col">Surname</th>
                  <th scope="col">Email address</th>
                  <th scope="col">Mobile number</th>
                  <th scope="col">Business role(s)</th>
                  <th scope="col">Job title</th>
                  <th scope="col">Selected role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((person) => {
                  const { first, surname } = nameParts(person.name);
                  return (
                    <tr key={person.id}>
                      <th scope="row">
                        <span className={access.firstName}>
                          <span className={access.avatar} aria-hidden="true">
                            {initials(person.name)}
                          </span>
                          {first}
                        </span>
                      </th>
                      <td>{surname}</td>
                      <td>{person.email}</td>
                      <td>{person.mobile}</td>
                      <td>{person.businessRoles.join(', ')}</td>
                      <td>{jobTitles[person.id] || '—'}</td>
                      <td>{roleTitle}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Block>

      {PERMISSION_SECTIONS.map((section) => {
        const sectionIds = section.groups.flatMap(groupIds);
        if (!applies(sectionIds)) return <Block key={section.id} title={section.title} summary={NOT_APPLICABLE} />;
        return (
          <Block key={section.id} title={section.title} summary={selectedCount(sectionIds)}>
            <div className={cx(access.groups, section.id !== 'payment' && access.groupsSideBySide)}>
              {section.groups.map((group) => {
                const ids = groupIds(group);
                if (!applies(ids))
                  return <Block key={group.id} variant="group" title={group.title} summary={NOT_APPLICABLE} />;
                return (
                  <Block key={group.id} variant="group" title={group.title} summary={selectedCount(ids)}>
                    <div className={cx(access.columns, INLINE_GROUPS.has(group.id) && access.inline)}>
                      {group.columns.map((column, index) => (
                        <ul key={index} className={access.permissions}>
                          {column
                            // Inline groups only list what's included, as in the design
                            .filter((permission) => !INLINE_GROUPS.has(group.id) || enabled.has(permission.id))
                            .map((permission) => {
                              const on = enabled.has(permission.id);
                              return (
                                <li key={permission.id} className={cx(styles.item, !on && styles.itemOff)}>
                                  <Mark on={on} />
                                  {permission.label}
                                  <span className={access.srOnly}>{on ? ' (included)' : ' (not included)'}</span>
                                </li>
                              );
                            })}
                        </ul>
                      ))}
                    </div>
                  </Block>
                );
              })}
              {section.id === 'payment' &&
                (rules.releaseLevels ? (
                  <Block variant="group" title="Release levels" summary={`Level ${releaseLevel}`}>
                    <p className={styles.level}>
                      <Mark on />
                      {RELEASE_LEVELS.find((level) => level.value === releaseLevel)?.label}
                    </p>
                  </Block>
                ) : (
                  <Block variant="group" title="Release levels" summary={NOT_APPLICABLE} />
                ))}
            </div>
          </Block>
        );
      })}

      <Block title="Select accounts and limits" summary={`${accounts.length} Selected`}>
        <div className={accountStyles.groups}>
          {ACCOUNT_GROUPS.map((group) => {
            const groupAccounts = accounts.filter((account) => account.kind === group.kind);
            if (groupAccounts.length === 0) return null;
            return (
              <section key={group.kind} aria-labelledby={`${id}-${group.kind}`}>
                <h3 id={`${id}-${group.kind}`} className={accountStyles.groupTitle}>
                  {group.title}
                  <span className={accountStyles.count}>{groupAccounts.length}</span>
                </h3>
                <ul className={accountStyles.rows}>
                  {groupAccounts.map((account) => (
                    <li key={account.id} className={accountStyles.row}>
                      <Mark on />
                      <AccountIcon type={ICON_TYPES[account.kind]} className={accountStyles.icon} />
                      <span className={accountStyles.info}>
                        <span className={accountStyles.name}>{account.name}</span>
                        <span className={accountStyles.detail}>
                          {account.number}
                          {account.isDefault && ' - Default Acc.'}
                        </span>
                        <span className={accountStyles.detail}>Acc. limit - R {formatLimit(account.accountLimit)}</span>
                      </span>
                      <span className={accountStyles.limits}>
                        {LIMIT_COLUMNS.map((field) =>
                          account.limits[field] === undefined ? null : (
                            <TextField
                              key={field}
                              variant="floating"
                              label={`${LIMIT_LABELS[field]}*`}
                              aria-label={`${LIMIT_LABELS[field]} for ${account.name} ${account.number}`}
                              startAdornment="R"
                              readOnly
                              value={accountStates[account.id].limits[field] ?? ''}
                              className={cx(accountStyles.limit, accountStyles[field])}
                            />
                          ),
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
          {accounts.length === 0 && <p className={styles.empty}>No accounts selected.</p>}
        </div>
      </Block>

      <Alert
        variant="info"
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 11v6M12 7.5v.5" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        }
        className={access.check}
      >
        Please ensure all information is correct before continuing
      </Alert>
    </InviteFrame>
  );
}
