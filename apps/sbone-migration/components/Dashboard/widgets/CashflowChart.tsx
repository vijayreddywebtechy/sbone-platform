'use client';

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { formatRand, type CashflowMonth } from '../dashboardData';
import styles from './CashflowChart.module.scss';

export type ChartKind = 'area' | 'bar';

const MIN_WIDTH = 480; // Narrower than this, the chart scrolls sideways instead of squeezing its labels
const HEIGHT = 220;
const PAD = { top: 12, right: 12, bottom: 28, left: 40 };
const BAR_GAP = 2;

/** Rounds the axis maximum up to a tidy step (1, 2, 2.5 or 5 × 10ⁿ) with five gridlines. */
function niceScale(value: number) {
  const raw = value / 5;
  const magnitude = 10 ** Math.floor(Math.log10(raw || 1));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((s) => s >= raw) ?? raw;
  return { max: step * 5, step };
}

const short = (value: number) => (value === 0 ? '0' : value >= 1000 ? `${+(value / 1000).toFixed(1)}k` : `${value}`);

/** Money in vs money out by month, as overlapping areas or grouped bars, with a hover tooltip. */
export function CashflowChart({ data, kind }: { data: CashflowMonth[]; kind: ChartKind }) {
  const [active, setActive] = useState<number | null>(null);
  const [width, setWidth] = useState(720);
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Draw at the card's real pixel width so labels stay 11px at any screen size
  useEffect(() => {
    const element = wrapRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.max(MIN_WIDTH, Math.floor(entry.contentRect.width))));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const { max, step } = niceScale(Math.max(1, ...data.flatMap((d) => [d.moneyIn, d.moneyOut])));
  const plotWidth = width - PAD.left - PAD.right;
  const plotHeight = HEIGHT - PAD.top - PAD.bottom;
  const y = (value: number) => PAD.top + plotHeight - (value / max) * plotHeight;
  const ticks = Array.from({ length: 6 }, (_, i) => i * step);

  // Areas run point to point across the full width; bars sit in equal month slots
  const slot = plotWidth / data.length;
  const xPoint = (i: number) => PAD.left + (data.length === 1 ? plotWidth / 2 : (i / (data.length - 1)) * plotWidth);
  const xSlot = (i: number) => PAD.left + slot * i + slot / 2;
  const x = kind === 'area' ? xPoint : xSlot;

  const line = (key: 'moneyIn' | 'moneyOut') => data.map((d, i) => `${i ? 'L' : 'M'}${xPoint(i)},${y(d[key])}`).join(' ');
  const area = (key: 'moneyIn' | 'moneyOut') => `${line(key)} L${xPoint(data.length - 1)},${y(0)} L${xPoint(0)},${y(0)} Z`;

  const barWidth = Math.min(14, (slot * 0.5 - BAR_GAP) / 2);
  const bar = (left: number, value: number) => {
    const top = y(value);
    const bottom = y(0);
    if (bottom - top < 0.5) return '';
    const r = Math.min(4, barWidth / 2, bottom - top);
    return `M${left},${bottom} V${top + r} Q${left},${top} ${left + r},${top} H${left + barWidth - r} Q${left + barWidth},${top} ${left + barWidth},${top + r} V${bottom} Z`;
  };

  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = event.clientX - rect.left - PAD.left;
    const index = kind === 'area' ? Math.round((px / plotWidth) * (data.length - 1)) : Math.floor(px / slot);
    setActive(index >= 0 && index < data.length ? index : null);
  };

  const point = active !== null ? data[active] : null;

  return (
    <div ref={wrapRef} className={styles.scroll}>
      <div className={styles.chart} style={{ width }}>
        <svg
          ref={svgRef}
          width={width}
          height={HEIGHT}
          viewBox={`0 0 ${width} ${HEIGHT}`}
          className={styles.svg}
          role="img"
          aria-label="Money in and money out by month"
          onPointerMove={onPointerMove}
          onPointerLeave={() => setActive(null)}
        >
          {ticks.map((tick) => (
            <g key={tick}>
              <line x1={PAD.left} x2={width - PAD.right} y1={y(tick)} y2={y(tick)} className={styles.grid} />
              <text x={PAD.left - 8} y={y(tick)} className={styles.axisY}>
                {short(tick)}
              </text>
            </g>
          ))}
          {data.map((d, i) => (
            <text key={d.month} x={x(i)} y={HEIGHT - 8} className={styles.axisX}>
              {d.month}
            </text>
          ))}

          {kind === 'area' ? (
            <>
              <path d={area('moneyIn')} className={styles.areaIn} />
              <path d={area('moneyOut')} className={styles.areaOut} />
              <path d={line('moneyIn')} className={styles.lineIn} />
              <path d={line('moneyOut')} className={styles.lineOut} />
              {point && active !== null && (
                <>
                  <line x1={x(active)} x2={x(active)} y1={PAD.top} y2={y(0)} className={styles.crosshair} />
                  <circle cx={x(active)} cy={y(point.moneyIn)} r={5} className={styles.dotIn} />
                  <circle cx={x(active)} cy={y(point.moneyOut)} r={5} className={styles.dotOut} />
                </>
              )}
            </>
          ) : (
            data.map((d, i) => (
              <g key={d.month}>
                {active === i && <rect x={xSlot(i) - slot / 2 + 2} y={PAD.top} width={slot - 4} height={plotHeight} rx={4} className={styles.hover} />}
                <path d={bar(xSlot(i) - barWidth - BAR_GAP / 2, d.moneyIn)} className={styles.barIn} />
                <path d={bar(xSlot(i) + BAR_GAP / 2, d.moneyOut)} className={styles.barOut} />
              </g>
            ))
          )}
        </svg>

        {point && active !== null && (
          <div className={styles.tooltip} style={{ left: x(active) }} data-flip={active > data.length / 2 || undefined} role="status">
            <strong className={styles.tooltipTitle}>{point.month}</strong>
            <span className={styles.tooltipRow}>
              <span className={styles.keyIn} aria-hidden="true" />
              Money in <b>{formatRand(point.moneyIn)}</b>
            </span>
            <span className={styles.tooltipRow}>
              <span className={styles.keyOut} aria-hidden="true" />
              Money out <b>{formatRand(point.moneyOut)}</b>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
