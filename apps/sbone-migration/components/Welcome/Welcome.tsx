import { AppDownload } from './sections/AppDownload';
import { Faq } from './sections/Faq';
import { Features } from './sections/Features';
import { GetStarted } from './sections/GetStarted';
import { Hero } from './sections/Hero';
import { SuccessStories } from './sections/SuccessStories';
import { Solutions } from './sections/Solutions';
import { Support } from './sections/Support';
import { SwitchBanner } from './sections/SwitchBanner';

/** Public SBOne landing page — the first screen of the platform. */
export function Welcome() {
  return (
    <>
      <Hero />
      <Features />
      <GetStarted />
      <AppDownload />
      <SuccessStories />
      <Solutions />
      <Support />
      <Faq />
      <SwitchBanner />
    </>
  );
}
