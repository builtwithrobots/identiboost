'use client'

import { useHeroVariant } from '@/lib/hooks/use-hero-variant'
import { AnimatedHeroText, type HeroContent } from '@/components/marketing/animated-hero-text'
import HeroDemoCard from './HeroDemoCard'

const CANDIDATE_VARIANTS: HeroContent[] = [
  // Variant 0 -- emotional (first-time visitors, social)
  {
    kicker: 'The profile that answers back.',
    headlineLine1: 'Your identity.',
    headlineLine2: 'Boosted.',
    subheadline:
      'Tell your story once. IdentiBoost builds a verified Identity AI that answers questions from anyone around the clock, plus audio, video, infographic, and slide-deck Boosts, all behind one link.',
    primaryCTA: 'Build My Profile Free',
    primaryHref: '/sign-up',
    secondaryCTA: 'See a live example',
    secondaryHref: '/boosts',
    proofLine: 'Always representing you. 24/7/365.',
  },
  // Variant 1 -- direct, mechanic-first (paid traffic, SEO)
  {
    kicker: 'Stop repeating your story in every conversation.',
    headlineLine1: 'They have questions.',
    headlineLine2: 'Your AI has answers, 24/7.',
    subheadline:
      'IdentiBoost turns your professional story into a personal Identity AI that fields questions any hour, backed by audio, video, infographic, and slide-deck Boosts behind one shareable link.',
    primaryCTA: 'Build My Profile Free',
    primaryHref: '/sign-up',
    secondaryCTA: 'See a live example',
    secondaryHref: '/boosts',
    proofLine: 'No follow-ups lost to a static page. No questions you miss while you sleep.',
  },
  // Variant 2 -- professional pain (communities, referral)
  {
    kicker: 'Built for professionals who are done being overlooked.',
    headlineLine1: 'Your results deserve',
    headlineLine2: 'more than a static page.',
    subheadline:
      'Stop letting one flat page speak for years of results. Whether you are a job candidate, consultant, founder, or speaker, IdentiBoost builds your complete professional profile and gives you a personal AI that represents you around the clock.',
    primaryCTA: 'Get started free',
    primaryHref: '/sign-up',
    secondaryCTA: 'Watch how it works',
    secondaryHref: '/boosts',
    proofLine: 'One link. Every version of you. Your identity. Boosted.',
  },
]

export default function LandingHero() {
  const variant = useHeroVariant()
  const content = CANDIDATE_VARIANTS[variant] ?? CANDIDATE_VARIANTS[0]

  return (
    <section className="bg-[#FFFBF5] py-16 md:py-24" aria-labelledby="hero-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Copy column */}
          <div>
            <AnimatedHeroText content={content} variantIndex={variant} headingId="hero-heading" />
          </div>

          {/* Visual demo column, static across variants */}
          <div className="w-full max-w-[520px] mx-auto lg:mx-0 lg:justify-self-end">
            <HeroDemoCard />
          </div>
        </div>
      </div>
    </section>
  )
}
