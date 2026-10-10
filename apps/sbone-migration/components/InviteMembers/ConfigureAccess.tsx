'use client';

import { useId } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Alert, Button, cx, Panel, Switch } from '@sbone/shared';
import { rememberFlowStep, useStepBack } from '@/lib/stepNavigation';
import {
  ACCESS_ROLES,
  INLINE_GROUPS,
  PERMISSION_SECTIONS,
  RELEASE_LEVELS,
  ROLE_RULES,
  type AccessRole,
  type PermissionGroup,
} from './accessData';
import { useInvite } from './InviteContext';
import { Block } from './Block';
import { InviteFrame } from './InviteFrame';
import { DIRECTORS } from './inviteData';
import styles from './ConfigureAccess.module.scss';

const NOT_APPLICABLE = 'Not applicable for this role';

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

/** Step 3 of inviting team members: choose a role and fine-tune what the selected users may do. */
export function ConfigureAccess() {
  const goBack = useStepBack('/roles-permissions/invite/users');
  const router = useRouter();
  const goNext = () => {
    const next = '/roles-permissions/invite/accounts';
    rememberFlowStep(next);
    router.push(next);
  };
  const groupId = useId();
  const { selectedIds, jobTitles, removeSelected } = useInvite();
  const { role, setRole, permissions, setPermissions, releaseLevel, setReleaseLevel } = useInvite();
  const enabled = new Set(permissions);

  const rules = ROLE_RULES[role];
  const allowed = new Set(rules.allowed);
  const roleTitle = ACCESS_ROLES.find((item) => item.value === role)?.title ?? '';
  const users = selectedIds
    .map((id) => DIRECTORS.find((person) => person.id === id))
    .filter((person) => person !== undefined);

  // Choosing a role resets the switches to that role's defaults
  const chooseRole = (next: AccessRole) => {
    setRole(next);
    setPermissions(ROLE_RULES[next].defaults);
  };

  const toggle = (id: string, on: boolean) =>
    setPermissions((current) => (on ? [...current, id] : current.filter((item) => item !== id)));

  const groupIds = (group: PermissionGroup) => group.columns.flat().map((permission) => permission.id);
  const groupSummary = (ids: string[]) => {
    if (!ids.some((id) => allowed.has(id))) return NOT_APPLICABLE;
    return `${ids.filter((id) => enabled.has(id)).length} Selected`;
  };

  const renderGroup = (group: PermissionGroup) => (
    <div className={cx(styles.columns, INLINE_GROUPS.has(group.id) && styles.inline)}>
      {group.columns.map((column, index) => (
        <ul key={index} className={styles.permissions}>
          {column.map((permission) => (
            <li key={permission.id}>
              <Switch
                label={permission.label}
                checked={enabled.has(permission.id)}
                disabled={!allowed.has(permission.id)}
                onChange={(on) => toggle(permission.id, on)}
              />
            </li>
          ))}
        </ul>
      ))}
    </div>
  );

  return (
    <InviteFrame
      currentStep={2}
      title="Configure access"
      subtitle="Add new team member(s) or third-party collaborator"
      actions={
        <>
          <Button variant="text" onClick={goBack}>
            Back
          </Button>

          <Button variant="secondary" disabled={users.length === 0} onClick={goNext}>
            Next
          </Button>
        </>
      }
    >
      <Panel
        title="Role"
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3 5 6v5c0 4.4 3 8.3 7 9.5 4-1.2 7-5.1 7-9.5V6Z" />
          </svg>
        }
      >
      <fieldset className={styles.roleField}>
        <legend className={styles.legend}>Select a role to be applied</legend>
        <div className={styles.roles}>
          {ACCESS_ROLES.map((item) => (
            <label key={item.value} className={cx(styles.role, role === item.value && styles.roleSelected)}>
              <input
                type="radio"
                name={`${groupId}-role`}
                value={item.value}
                checked={role === item.value}
                onChange={() => chooseRole(item.value)}
                className={styles.roleRadio}
              />
              <span className={styles.roleTitle}>{item.title}</span>
              <span className={styles.roleText}>{item.description}</span>
            </label>
          ))}
        </div>
      </fieldset>
      </Panel>

      <Block title="Apply role to these users" summary={`${users.length} Selected`}>
        {users.length === 0 ? (
          <p className={styles.noUsers}>
            No users selected. <Link href="/roles-permissions/invite/users">Go back to select users</Link>.
          </p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">First name</th>
                  <th scope="col">Surname</th>
                  <th scope="col">Email address</th>
                  <th scope="col">Mobile number</th>
                  <th scope="col">Business role(s)</th>
                  <th scope="col">Job title</th>
                  <th scope="col">Selected role</th>
                  <th scope="col">
                    <span className={styles.srOnly}>Remove</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((person) => {
                  const { first, surname } = nameParts(person.name);
                  return (
                    <tr key={person.id}>
                      <th scope="row">
                        <span className={styles.firstName}>
                          <span className={styles.avatar} aria-hidden="true">
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
                      <td>
                        <button
                          type="button"
                          className={styles.remove}
                          aria-label={`Remove ${person.name}`}
                          title="Remove"
                          onClick={() => removeSelected(person.id)}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
                          </svg>
                        </button>
                      </td>
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
        const sectionAllowed = sectionIds.some((id) => allowed.has(id));
        return (
          <Block
            key={section.id}
            title={section.title}
            summary={sectionAllowed ? `${sectionIds.filter((id) => enabled.has(id)).length} Selected` : NOT_APPLICABLE}
          >
            <div className={cx(styles.groups, section.id !== 'payment' && styles.groupsSideBySide)}>
              {section.groups.map((group) => (
                <Block key={group.id} variant="group" title={group.title} summary={groupSummary(groupIds(group))}>
                  {renderGroup(group)}
                </Block>
              ))}
              {section.id === 'payment' && (
                <Block
                  variant="group"
                  title="Release levels"
                  summary={rules.releaseLevels ? `Level ${releaseLevel}` : NOT_APPLICABLE}
                >
                  <fieldset className={styles.levels} disabled={!rules.releaseLevels}>
                    <legend className={styles.srOnly}>Release level</legend>
                    {RELEASE_LEVELS.map((level) => (
                      <label key={level.value} className={styles.level}>
                        <input
                          type="radio"
                          name={`${groupId}-release-level`}
                          value={level.value}
                          checked={rules.releaseLevels && releaseLevel === level.value}
                          onChange={() => setReleaseLevel(level.value)}
                        />
                        {level.label}
                      </label>
                    ))}
                  </fieldset>
                </Block>
              )}
            </div>
          </Block>
        );
      })}

      <Alert
        variant="info"
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 11v6M12 7.5v.5" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        }
        className={styles.check}
      >
        Please ensure all information is correct before continuing
      </Alert>
    </InviteFrame>
  );
}
