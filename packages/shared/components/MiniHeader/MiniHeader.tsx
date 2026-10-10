import { cx } from '../../utils/classNames';
import styles from './MiniHeader.module.scss';

export interface MiniHeaderProps {
  className?: string;
}

/** Thin white bar above the AppHeader carrying the "SBOne" product name. */
export function MiniHeader({ className }: MiniHeaderProps) {
  return (
    <div className={cx(styles.miniHeader, className)}>
      <span className={styles.brand}>
        <strong>SB</strong>One
      </span>
    </div>
  );
}
