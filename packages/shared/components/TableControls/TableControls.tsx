'use client';

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { cx } from '../../utils/classNames';
import styles from './TableControls.module.scss';

// Light controls shared by the list screens (Accounts, Queries): figure strip, toolbar, segmented switch,
// search, filter menu and pager, so every table looks and behaves the same.

const Icon = ({ children, size = 16 }: { children: ReactNode; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

export interface Figure {
  label: string;
  value: ReactNode;
  note?: string;
  /** Hover hint shown as an (i) after the label */
  info?: string;
  /** Small coloured dot before the label, e.g. a status colour */
  dotColor?: string;
  /** Red value, e.g. an overdrawn balance */
  negative?: boolean;
}

/** Plain figures divided by hairlines: one column on narrow phones, two from 380px (or md when `wide`), four from lg */
export function FigureStrip({
  figures,
  wide = false,
  className,
}: {
  figures: Figure[];
  /** Values too long for two per row on phones */
  wide?: boolean;
  className?: string;
}) {
  return (
    <dl className={cx(styles.figures, wide && styles.figuresWide, className)} style={{ '--figure-columns': Math.min(figures.length, 4) } as CSSProperties}>
      {figures.map((figure) => (
        <div key={figure.label} className={styles.figure}>
          <dt>
            {figure.dotColor && <span className={styles.dot} style={{ background: figure.dotColor }} aria-hidden="true" />}
            {figure.label}
            {figure.info && (
              <span className={styles.info} title={figure.info} aria-label={figure.info} role="img">
                <Icon size={14}>
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 11v5M12 8h.01" />
                </Icon>
              </span>
            )}
          </dt>
          <dd className={cx(figure.negative && styles.negative)}>{figure.value}</dd>
          {figure.note && <span className={styles.note}>{figure.note}</span>}
        </div>
      ))}
    </dl>
  );
}

/** Row above a table: view switch on the left, search and filter on the right */
export function Toolbar({ start, end }: { start?: ReactNode; end?: ReactNode }) {
  return (
    <div className={styles.toolbar}>
      {start}
      {end && <div className={styles.toolbarEnd}>{end}</div>}
    </div>
  );
}

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  count?: number;
  /** Shown instead of the label, which then becomes the segment's accessible name and tooltip */
  icon?: ReactNode;
}

/** Icons for a cards / list view switch */
export const CardsViewIcon = () => (
  <Icon>
    <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
    <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
    <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" />
    <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
  </Icon>
);

export const ListViewIcon = () => (
  <Icon>
    <path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" />
  </Icon>
);

/** Icons for an area / bar chart switch */
export const AreaChartIcon = () => (
  <Icon>
    <path d="M4 20h16" />
    <path d="M4 16.5 9 10l4 3.5 7-7.5V17H4z" />
  </Icon>
);

export const BarChartIcon = () => (
  <Icon>
    <path d="M4 20h16M7 16v-5M12 16V6M17 16v-8" />
  </Icon>
);

/** Light segmented switch for picking one view of a table */
export function Segmented<T extends string>({ label, options, value, onChange }: { label: string; options: Array<SegmentOption<T>>; value: T; onChange: (value: T) => void }) {
  return (
    <div className={styles.segmented} role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={cx(styles.segment, option.icon !== undefined && styles.segmentIcon, option.value === value && styles.segmentActive)}
          aria-pressed={option.value === value}
          aria-label={option.icon !== undefined ? option.label : undefined}
          title={option.icon !== undefined ? option.label : undefined}
          onClick={() => onChange(option.value)}
        >
          {option.icon ?? option.label}
          {option.count !== undefined && <span className={styles.segmentCount}>{option.count}</span>}
        </button>
      ))}
    </div>
  );
}

/** Search box for a table toolbar */
export function SearchBox({ label, value, onChange, placeholder = 'Search' }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <label className={styles.search}>
      <span className={styles.srOnly}>{label}</span>
      <Icon>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </Icon>
      <input type="search" placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

/** Filter button whose choices open in a small menu over the table, so nothing below moves */
export function FilterMenu({
  title,
  options,
  value,
  defaultValue,
  onChange,
  buttonLabel = 'Filter',
}: {
  title: string;
  options: Array<{ value: string; label: string }>;
  value: string;
  defaultValue: string;
  onChange: (value: string) => void;
  /** Text on the button, e.g. "Sort" when the menu orders rather than filters */
  buttonLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const active = value !== defaultValue ? options.find((option) => option.value === value) : undefined;

  // Close on an outside click or Escape
  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className={styles.filterMenu} ref={rootRef}>
      <button
        type="button"
        className={cx(styles.quietControl, active && styles.quietControlActive)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((current) => !current)}
      >
        <Icon>
          <path d="M4 6h16M7 12h10M10 18h4" />
        </Icon>
        {buttonLabel}
        {active && <span className={styles.filterValue}>· {active.label}</span>}
      </button>
      <div id={menuId} role="menu" aria-label={title} className={styles.popover} hidden={!open}>
        <span className={styles.popoverTitle} aria-hidden="true">
          {title}
        </span>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            role="menuitemradio"
            aria-checked={option.value === value}
            className={styles.popoverOption}
            onClick={() => {
              onChange(option.value);
              setOpen(false);
            }}
          >
            {option.label}
            {option.value === value && (
              <Icon>
                <path d="m5 12.5 4.5 4.5L19 7.5" />
              </Icon>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Row count on the left, numbered pages on the right */
export function Pager({ label, page, pageCount, total, perPage, onPage }: { label: string; page: number; pageCount: number; total: number; perPage: number; onPage: (page: number) => void }) {
  const windowStart = Math.max(0, Math.min(page - 1, pageCount - 3));
  const pages = Array.from({ length: Math.min(3, pageCount) }, (_, i) => windowStart + i);
  return (
    <div className={styles.pager}>
      <span className={styles.range}>
        {total === 0 ? 0 : page * perPage + 1}–{Math.min(total, (page + 1) * perPage)} of {total}
      </span>
      <nav className={styles.pages} aria-label={label}>
        <button type="button" className={styles.pageButton} aria-label="Previous page" disabled={page === 0} onClick={() => onPage(page - 1)}>
          <Icon>
            <path d="m15 6-6 6 6 6" />
          </Icon>
        </button>
        {pages.map((index) => (
          <button
            key={index}
            type="button"
            className={cx(styles.pageButton, index === page && styles.pageActive)}
            aria-label={`Page ${index + 1}`}
            aria-current={index === page ? 'page' : undefined}
            onClick={() => onPage(index)}
          >
            {index + 1}
          </button>
        ))}
        <button type="button" className={styles.pageButton} aria-label="Next page" disabled={page >= pageCount - 1} onClick={() => onPage(page + 1)}>
          <Icon>
            <path d="m9 6 6 6-6 6" />
          </Icon>
        </button>
      </nav>
    </div>
  );
}
