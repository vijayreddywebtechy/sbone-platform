import Image from 'next/image';
import { Button } from '@sbone/shared';
import { ArrowIcon, ArticleIcon, PlayIcon } from '../icons';
import styles from './SuccessStories.module.scss';

const STORIES = [
  {
    category: 'Transport & Logistics',
    date: '2025-07-29',
    title: 'Partnering with Jacobs Transport helped them expand operations and embrace sustainability.',
    action: 'Watch video',
    video: true,
    image: '/images/welcome/story-transport.svg',
  },
  {
    category: 'Agriculture',
    date: '2024-09-23',
    title: 'Standard Bank’s first hydro plant financing to power up Lowmar Farm.',
    action: 'Read more',
    video: false,
    image: '/images/welcome/story-agriculture.svg',
  },
  {
    category: 'Logistics',
    date: '2025-11-09',
    title: 'GALXBOY Growth story from Mamelodi to the world, from one rebellious t-shirt to a fashion empire.',
    action: 'Read more',
    video: false,
    image: '/images/welcome/story-fashion.svg',
  },
];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' });

export function SuccessStories() {
  return (
    <section id="success-stories" className={styles.section} aria-labelledby="stories-title">
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 id="stories-title" className={styles.title}>
            Client success stories
          </h2>
          <p className={styles.intro}>Find out how our solutions are positively impacting clients.</p>
        </header>

        <ul className={styles.grid}>
          {STORIES.map((story) => (
            <li key={story.title}>
              <article className={styles.card}>
                <div className={styles.media}>
                  <Image src={story.image} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className={styles.image} />
                  <span className={styles.mediaBadge} aria-hidden="true">
                    {story.video ? <PlayIcon /> : <ArticleIcon />}
                  </span>
                </div>
                <div className={styles.body}>
                  <p className={styles.meta}>
                    <span>{story.category}</span>
                    <time dateTime={story.date}>{formatDate(story.date)}</time>
                  </p>
                  <h3 className={styles.cardTitle}>{story.title}</h3>
                  <a href="#" className={styles.link}>
                    {story.action}
                    <ArrowIcon />
                  </a>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <div className={styles.more}>
          <Button variant="secondary">View more stories</Button>
        </div>
      </div>
    </section>
  );
}
