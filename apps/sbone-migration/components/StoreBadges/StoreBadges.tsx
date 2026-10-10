import { cx } from '@sbone/shared';
import styles from './StoreBadges.module.scss';

const STORES = [
  { name: 'Google Play', caption: 'Get it on', href: 'https://play.google.com/store' },
  { name: 'App Store', caption: 'Download on the', href: 'https://www.apple.com/app-store/' },
];

const APP_GALLERY = { name: 'AppGallery', caption: 'Explore it on', href: 'https://appgallery.huawei.com/' };

export interface StoreBadgesProps {
  includeAppGallery?: boolean;
  className?: string;
}

/** Text-based app store badges; swap for the official badge artwork when it is supplied. */
export function StoreBadges({ includeAppGallery = false, className }: StoreBadgesProps) {
  const stores = includeAppGallery ? [...STORES, APP_GALLERY] : STORES;

  return (
    <ul className={cx(styles.badges, className)}>
      {stores.map((store) => (
        <li key={store.name}>
          <a href={store.href} className={styles.badge} target="_blank" rel="noreferrer">
            <span className={styles.caption}>{store.caption}</span>
            <span className={styles.name}>{store.name}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
