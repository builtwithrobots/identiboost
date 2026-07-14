'use client'

import { useHeroVariant } from '@/lib/hooks/use-hero-variant'
import { AnimatedHeroText, type HeroContent } from '@/components/marketing/animated-hero-text'
import HeroDemoCard, { type QaPair } from './HeroDemoCard'

const RECRUITER_VARIANTS: HeroContent[] = [
  // Variant 0 -- AI interrogation (leads with the core mechanic)
  {
    kicker: 'For teams',
    headlineLine1: 'Stop guessing.',
    headlineLine2: 'Talk to their AI.',
    subheadline:
      "Every IdentiBoost professional comes with a personal Identity AI you can question 24/7, plus audio, video, infographic, and deck Boosts behind one link. Know who you're calling before you pick up the phone.",
    primaryCTA: 'Start evaluating free',
    primaryHref: '/sign-up',
    secondaryCTA: 'See a live profile',
    secondaryHref: '/boosts',
    proofLine: 'Full transcript delivered to your inbox after every AI session.',
  },
  // Variant 1 -- time savings (busy evaluators)
  {
    kicker: 'Screen smarter. Decide faster.',
    headlineLine1: 'Know your shortlist',
    headlineLine2: 'before the first call.',
    subheadline:
      'IdentiBoost professionals give you a live AI you can question, a podcast-style overview, an infographic, and a full resume, all from one link. The first call becomes a confirmation, not an interrogation.',
    primaryCTA: 'Start evaluating free',
    primaryHref: '/sign-up',
    secondaryCTA: 'Browse example profiles',
    secondaryHref: '/boosts',
    proofLine: 'One link. Every format. Zero back-and-forth.',
  },
  // Variant 2 -- signal over noise (evaluation-heavy teams)
  {
    kicker: 'For teams tired of paper theater.',
    headlineLine1: 'The best people',
    headlineLine2: "don't always look it on paper.",
    subheadline:
      'IdentiBoost surfaces the story behind the page: an Identity AI that answers your toughest questions directly, backed by audio, video, and infographic Boosts. Find the professionals worth calling.',
    primaryCTA: 'Start evaluating free',
    primaryHref: '/sign-up',
    secondaryCTA: 'See a live example',
    secondaryHref: '/boosts',
    proofLine: 'No camera required. No performance anxiety. Just the real story.',
  },
]

/* Recruiter-POV exchange: the AI as a screening tool that saves the recruiter time */
const RECRUITER_CHAT_PAIRS: QaPair[] = [
  {
    question: 'Does Jordan have team lead experience?',
    answer:
      'Yes. Covered full team lead responsibilities for 3 weeks during a supervisor absence. First non-lead selected for that role at the branch. Also onboarded and mentored two tellers in Q1 2025.',
  },
]

export default function RecruiterHero() {
  const variant = useHeroVariant()
  const content = RECRUITER_VARIANTS[variant] ?? RECRUITER_VARIANTS[0]

  return (
    <section className="bg-[#FFFBF5] py-16 md:py-24" aria-labelledby="recruiter-hero-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Copy column, right on desktop, first on mobile */}
          <div className="order-1 lg:order-2">
            <AnimatedHeroText
              content={content}
              variantIndex={variant}
              headingId="recruiter-hero-heading"
            />
          </div>

          {/* Visual demo column, left on desktop, below copy on mobile */}
          <div className="order-2 lg:order-1 w-full max-w-[520px] mx-auto lg:mx-0 lg:justify-self-start">
            <HeroDemoCard chatPairs={RECRUITER_CHAT_PAIRS} />
          </div>
        </div>
      </div>
    </section>
  )
}
