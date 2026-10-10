'use client';

import { useState } from 'react';
import { Dropdown, type DropdownOption } from '../Dropdown/Dropdown';

export type SelectOption = DropdownOption;

/** Change event shaped like a native <select>'s, so handlers can read event.target.value. */
export interface SelectChangeEvent {
  target: { value: string; name?: string };
}

export interface SelectProps {
  label: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (event: SelectChangeEvent) => void;
  placeholder?: string;
  hint?: string;
  error?: string;
  /** outlined = label above, floating = label on the top border. */
  variant?: 'outlined' | 'floating';
  /** Arrow on the box: filled triangle (default) or a line chevron. */
  indicator?: 'triangle' | 'chevron';
  id?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * Form select with the shared dropdown menu instead of the browser's native list, so it looks the same everywhere.
 * Works controlled (value + onChange) or uncontrolled (defaultValue).
 */
export function Select({
  label,
  options,
  value,
  defaultValue,
  onChange,
  placeholder,
  hint,
  error,
  variant = 'outlined',
  indicator,
  id,
  name,
  required,
  disabled,
  className,
}: SelectProps) {
  const [ownValue, setOwnValue] = useState(defaultValue ?? '');
  const current = value ?? ownValue;

  return (
    <Dropdown
      id={id}
      label={label}
      options={options}
      value={current}
      onChange={(next) => {
        if (value === undefined) setOwnValue(next);
        onChange?.({ target: { value: next, name } });
      }}
      placeholder={placeholder}
      hint={hint}
      error={error}
      name={name}
      required={required}
      disabled={disabled}
      labelPosition={variant === 'floating' ? 'floating' : 'above'}
      indicator={indicator}
      className={className}
    />
  );
}
