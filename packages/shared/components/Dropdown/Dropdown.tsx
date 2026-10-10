'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../utils/classNames';
import styles from './Dropdown.module.scss';

export interface DropdownOption {
  value: string;
  label: string;
  /** Second line under the label */
  description?: string;
  /** Secondary text after the label, in grey, e.g. a masked account number */
  meta?: string;
  disabled?: boolean;
}

export interface DropdownProps {
  label: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  name?: string;
  id?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  /** Rendered after the floating label, e.g. an (i) tooltip; not part of the field's accessible name. */
  labelAddon?: ReactNode;
  /** floating = label on the top border (default), above = plain label above the box, hidden = label for screen readers only. */
  labelPosition?: 'floating' | 'above' | 'hidden';
  /** field = bordered box (default); inline = borderless trigger that sits inside another control. */
  appearance?: 'field' | 'inline';
  /** Arrow on the trigger: filled triangle (default) or a line chevron. */
  indicator?: 'triangle' | 'chevron';
  className?: string;
}

const CheckIcon = () => (
  <svg className={styles.check} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

/**
 * Select with a styled menu (the same look in every browser) whose options can carry a grey meta text or a
 * description line. Implements the WAI-ARIA select-only combobox pattern (arrow keys, Home/End, Enter/Space, Esc, type-ahead).
 */
export function Dropdown({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select',
  name,
  id: idProp,
  error,
  hint,
  required,
  disabled,
  labelAddon,
  labelPosition = 'floating',
  appearance = 'field',
  indicator = 'triangle',
  className,
}: DropdownProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const labelId = `${id}-label`;
  const listboxId = `${id}-listbox`;
  const messageId = `${id}-message`;
  const optionId = (index: number) => `${id}-option-${index}`;

  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  // Opens upwards when there isn't room below the trigger
  const [dropUp, setDropUp] = useState(false);
  const selectedIndex = options.findIndex((option) => option.value === value);
  const [activeIndex, setActiveIndex] = useState(Math.max(selectedIndex, 0));
  const selected = options[selectedIndex];
  const message = error ?? hint;

  // Close when a click lands outside the component
  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  // Decide the direction before paint, so the menu doesn't flash below first
  useLayoutEffect(() => {
    if (!open || !rootRef.current || !listRef.current) return;
    const trigger = rootRef.current.getBoundingClientRect();
    const menuHeight = listRef.current.offsetHeight;
    const below = window.innerHeight - trigger.bottom;
    setDropUp(below < menuHeight + 16 && trigger.top > below);
  }, [open]);

  // Keep the highlighted option in view while moving with the keyboard
  useEffect(() => {
    if (!open) return;
    document.getElementById(optionId(activeIndex))?.scrollIntoView({ block: 'nearest' });
    // optionId only depends on id, which never changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, activeIndex]);

  const step = (from: number, direction: 1 | -1) => {
    for (let index = from + direction; index >= 0 && index < options.length; index += direction) {
      if (!options[index].disabled) return index;
    }
    return from;
  };

  const openList = () => {
    if (disabled) return;
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : step(-1, 1));
    setOpen(true);
  };

  const choose = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) return;
    setOpen(false);
    if (option.value !== value) onChange(option.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!open) openList();
        else setActiveIndex((index) => step(index, 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!open) openList();
        else setActiveIndex((index) => step(index, -1));
        break;
      case 'Home':
        if (open) {
          event.preventDefault();
          setActiveIndex(step(-1, 1));
        }
        break;
      case 'End':
        if (open) {
          event.preventDefault();
          setActiveIndex(step(options.length, -1));
        }
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (open) choose(activeIndex);
        else openList();
        break;
      case 'Escape':
        if (open) {
          // Close just the list, not a surrounding <dialog> (which also listens for Escape)
          event.preventDefault();
          event.stopPropagation();
          setOpen(false);
        }
        break;
      case 'Tab':
        setOpen(false);
        break;
      default:
        // Type-ahead: jump to the first option starting with the typed character
        if (event.key.length === 1 && /\S/.test(event.key)) {
          const match = options.findIndex((option) => !option.disabled && option.label.toLowerCase().startsWith(event.key.toLowerCase()));
          if (match >= 0) {
            if (!open) openList();
            setActiveIndex(match);
          }
        }
    }
  };

  return (
    <div
      ref={rootRef}
      className={cx(
        styles.field,
        labelPosition === 'above' && styles.labelAbove,
        labelPosition === 'hidden' && styles.labelHidden,
        appearance === 'inline' && styles.inline,
        className,
      )}
    >
      <span className={styles.label}>
        <span id={labelId}>{label}</span>
        {required && (
          <span className={styles.required} aria-hidden="true">
            {' '}
            *
          </span>
        )}
        {labelAddon && <span className={styles.labelAddon}>{labelAddon}</span>}
      </span>
      <button
        id={id}
        type="button"
        role="combobox"
        className={cx(styles.trigger, !selected && styles.placeholder, error && styles.invalid)}
        aria-labelledby={labelId}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={open ? optionId(activeIndex) : undefined}
        aria-invalid={Boolean(error)}
        aria-required={required || undefined}
        aria-describedby={message ? messageId : undefined}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={handleKeyDown}
      >
        <span className={styles.value}>
          {selected ? (
            <>
              {selected.label}
              {selected.meta && <span className={styles.meta}> {selected.meta}</span>}
            </>
          ) : (
            placeholder
          )}
        </span>
        {indicator === 'chevron' ? (
          <svg className={cx(styles.arrow, styles.chevron, open && styles.arrowOpen)} width="12" height="8" viewBox="0 0 12 8" aria-hidden="true">
            <path d="M1 1.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg className={cx(styles.arrow, open && styles.arrowOpen)} width="10" height="6" viewBox="0 0 10 6" aria-hidden="true">
            <path d="M0 0h10L5 6z" fill="currentColor" />
          </svg>
        )}
      </button>

      <ul
        ref={listRef}
        id={listboxId}
        role="listbox"
        aria-labelledby={labelId}
        className={cx(styles.menu, dropUp && styles.menuUp)}
        hidden={!open}
      >
        {options.map((option, index) => {
          const isSelected = option.value === value;
          return (
            <li
              key={option.value}
              id={optionId(index)}
              role="option"
              aria-selected={isSelected}
              aria-disabled={option.disabled || undefined}
              className={cx(styles.option, index === activeIndex && styles.active)}
              onPointerEnter={() => !option.disabled && setActiveIndex(index)}
              onClick={() => choose(index)}
            >
              <span className={styles.optionText}>
                <span className={styles.optionLabel}>
                  {option.label}
                  {option.meta && <span className={styles.meta}> {option.meta}</span>}
                </span>
                {option.description && <span className={styles.optionDescription}>{option.description}</span>}
              </span>
              {isSelected && <CheckIcon />}
            </li>
          );
        })}
      </ul>

      {name && <input type="hidden" name={name} value={value} />}
      {message && (
        <p id={messageId} className={cx(styles.message, error && styles.error)}>
          {message}
        </p>
      )}
    </div>
  );
}
