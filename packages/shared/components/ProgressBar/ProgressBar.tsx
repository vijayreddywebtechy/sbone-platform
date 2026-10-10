import { cx } from '../../utils/classNames';
import styles from './ProgressBar.module.scss';

export interface ProgressBarProps {
  /** 0–100 */
  value: number;
  label?: string;
  className?: string;
}

/** Application progress: labelled track with a "NN% Complete" pill. */
export function ProgressBar({ value, label = 'Application progress', className }: ProgressBarProps) {
  const percent = Math.round(Math.min(100, Math.max(0, value)));

  return (
    <div className={cx(styles.progress, className)}>
      <span className={styles.label}>{label}</span>
      <div className={styles.row}>
        <div
          className={styles.track}
          role="progressbar"
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
        >
          <div className={styles.fill} style={{ width: `${percent}%` }} />
        </div>
        <span className={styles.badge}>{percent}% Complete</span>
      </div>
    </div>
  );
}
