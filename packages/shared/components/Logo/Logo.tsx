import { cx } from '../../utils/classNames';
import logoOnColour from '../../assets/logos/standard-bank-logo-on-colour.svg';
import logoOnWhite from '../../assets/logos/standard-bank-logo-on-white.svg';
import styles from './Logo.module.scss';

// The artwork is 412×110 with the shield occupying the left 90 units; "mark" crops to the shield.
// Next.js imports images as { src, width, height }; other bundlers import them as a URL string
const urlOf = (image: string | { src: string }) => (typeof image === 'string' ? image : image.src);

const ARTWORK_ASPECT = 412 / 110;
const SHIELD_ASPECT = 90 / 110;

export interface LogoProps {
  /** full = shield + "Standard Bank" wordmark, mark = shield only. */
  variant?: 'full' | 'mark';
  /** Rendered height in px. */
  size?: number;
  /** colour = white wordmark for brand-blue backgrounds, white = navy wordmark for white backgrounds. */
  background?: 'colour' | 'white';
  className?: string;
}

/** Official Standard Bank logo, for brand-blue (default) or white backgrounds. */
export function Logo({ variant = 'full', size = 32, background = 'colour', className }: LogoProps) {
  const width = Math.round(size * (variant === 'full' ? ARTWORK_ASPECT : SHIELD_ASPECT));

  return (
    <span className={cx(styles.logo, className)} style={{ width, height: size }} role="img" aria-label="Standard Bank">
      {/* A small fixed-size SVG, cropped for the shield-only variant: next/image adds nothing here */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={urlOf(background === 'white' ? logoOnWhite : logoOnColour)} alt="" height={size} width={Math.round(size * ARTWORK_ASPECT)} className={styles.image} />
    </span>
  );
}
