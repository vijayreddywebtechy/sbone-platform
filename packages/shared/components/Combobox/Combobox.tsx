'use client';

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { cx } from '../../utils/classNames';
import styles from './Combobox.module.scss';

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxProps {
  label: string;
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  name?: string;
  error?: string;
  /** Shown when the typed text matches nothing. */
  noResultsText?: string;
  className?: string;
}

/**
 * Type-to-filter select (WAI-ARIA combobox with list autocomplete). Only values from `options` can be chosen;
 * leaving the field with unmatched text restores the last chosen option.
 */
export function Combobox({
  label,
  options,
  value,
  onChange,
  placeholder,
  name,
  error,
  noResultsText = 'No matches found',
  className,
}: ComboboxProps) {
  const id = useId();
  const inputId = `${id}-input`;
  const listboxId = `${id}-listbox`;
  const messageId = `${id}-message`;
  const optionId = (index: number) => `${id}-option-${index}`;

  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value);
  const selectedLabel = selected?.label ?? '';
  const [query, setQuery] = useState(selectedLabel);
  const [syncedLabel, setSyncedLabel] = useState(selectedLabel);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Keep the text in step when the value changes from outside (adjusted during render, not in an effect)
  if (selectedLabel !== syncedLabel) {
    setSyncedLabel(selectedLabel);
    setQuery(selectedLabel);
  }

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    // Show everything when the text is just the current selection
    if (!term || term === selected?.label.toLowerCase()) return options;
    return options.filter((option) => option.label.toLowerCase().includes(term));
  }, [options, query, selected?.label]);

  const close = () => {
    setOpen(false);
    setQuery(selected?.label ?? '');
  };

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close();
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  });

  const choose = (option: ComboboxOption | undefined) => {
    if (!option) return;
    setQuery(option.label);
    setOpen(false);
    if (option.value !== value) onChange(option.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!open) setOpen(true);
        else setActiveIndex((index) => Math.min(index + 1, filtered.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
        break;
      case 'Enter':
        if (open) {
          event.preventDefault();
          choose(filtered[activeIndex]);
        }
        break;
      case 'Escape':
        if (open) {
          // Close just the list, not a surrounding <dialog>
          event.preventDefault();
          event.stopPropagation();
          close();
        }
        break;
      case 'Tab':
        if (open) close();
        break;
    }
  };

  return (
    <div ref={rootRef} className={cx(styles.field, className)}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <div className={cx(styles.control, error && styles.invalid, open && styles.focused)}>
        <input
          id={inputId}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-activedescendant={open && filtered[activeIndex] ? optionId(activeIndex) : undefined}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? messageId : undefined}
          placeholder={placeholder}
          value={query}
          className={styles.input}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />
        <svg className={styles.arrow} width="10" height="6" viewBox="0 0 10 6" aria-hidden="true">
          <path d="M0 0h10L5 6z" fill="currentColor" />
        </svg>
      </div>

      <ul id={listboxId} role="listbox" aria-label={label} className={styles.menu} hidden={!open}>
        {filtered.map((option, index) => (
          <li
            key={option.value}
            id={optionId(index)}
            role="option"
            aria-selected={option.value === value}
            className={cx(styles.option, index === activeIndex && styles.active)}
            onPointerEnter={() => setActiveIndex(index)}
            // Choose on pointer down so the input doesn't lose the selection to blur handling
            onPointerDown={(event) => {
              event.preventDefault();
              choose(option);
            }}
          >
            {option.label}
          </li>
        ))}
        {filtered.length === 0 && <li className={styles.empty}>{noResultsText}</li>}
      </ul>

      {name && <input type="hidden" name={name} value={value} />}
      {error && (
        <p id={messageId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
