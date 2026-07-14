'use client'

import { useState, useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { fadeUp, staggerContainer, scaleIn } from '@/lib/motion'
import Link from 'next/link'

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

type PricingTier = {
  name: string
  price: string
  period?: string
  features: string[]
  cta: string
  ctaStyle: 'amber' | 'outline'
  popular: boolean
}

const candidateTiers: PricingTier[] = [
  {
    name: 'Starter',
    price: 'Free',
    features: [
      'Your professional profile',
      'Shareable link and QR code',
      'Basic Identity AI chat',
      'Transcript delivery after every conversation',
    ],
    cta: 'Get Started Free',
    ctaStyle: 'outline',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/mo',
    features: [
      'Everything in Starter',
      'Embed widget (coming soon)',
      'Conversation analytics',
      'Custom Q&A',
      'AI fine-tuning',
    ],
    cta: 'Go Pro',
    ctaStyle: 'amber',
    popular: true,
  },
  {
    name: 'Business',
    price: '$99',
    period: '/mo',
    features: [
      'Everything in Pro',
      'CRM export (coming soon)',
      'Advanced analytics',
      'Priority support',
    ],
    cta: 'Get Business',
    ctaStyle: 'outline',
    popular: false,
  },
]

const employerTiers: PricingTier[] = [
  {
    name: 'Team',
    price: '$299',
    period: '/mo',
    features: [
      'Up to 10 profiles',
      'Company AI layer',
      'Aggregate analytics',
    ],
    cta: 'Start with Team',
    ctaStyle: 'outline',
    popular: false,
  },
  {
    name: 'Growth',
    price: '$699',
    period: '/mo',
    features: [
      'Up to 25 profiles',
      'Everything in Team',
      'CRM integration (coming soon)',
    ],
    cta: 'Start with Growth',
    ctaStyle: 'amber',
    popular: true,
  },
  {
    name: 'Scale',
    price: '$1,499',
    period: '/mo',
    features: [
      'Unlimited profiles',
      'White label',
      'Dedicated onboarding',
    ],
    cta: 'Talk to Us',
    ctaStyle: 'outline',
    popular: false,
  },
]

function TierCard({ tier }: { tier: PricingTier }) {
  return (
    <motion.div
      variants={scaleIn}
      className={`relative bg-[#FFFBF5] rounded-2xl shadow-sm p-8 flex flex-col ${
        tier.popular
          ? 'border-2 border-[#D97706]'
          : 'border border-[#E8E0D0]'
      }`}
    >
      {tier.popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#D97706] font-jakarta text-[12px] font-semibold text-white">
            Most Popular
          </span>
        </div>
      )}

      <div className="mb-6">
        <p className="font-jakarta text-[13px] font-semibold text-[#6B7280] uppercase tracking-wide mb-3">
          {tier.name}
        </p>
        <div className="flex items-baseline gap-1">
          <span className="font-jakarta text-4xl font-bold text-[#1E3A5F]">
            {tier.price}
          </span>
          {tier.period && (
            <span className="font-inter text-sm text-gray-500">{tier.period}</span>
          )}
        </div>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <CheckIcon
              className={
                tier.popular ? 'text-[#D97706] flex-shrink-0 mt-0.5' : 'text-[#1E3A5F] flex-shrink-0 mt-0.5'
              }
            />
            <span className="font-inter text-sm text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href="/sign-up"
        className={
          tier.ctaStyle === 'amber'
            ? 'flex items-center justify-center px-6 py-3 rounded-lg bg-[#D97706] text-white font-jakarta text-[15px] font-semibold hover:bg-[#B45309] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97706] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFFBF5] transition-colors min-h-[44px]'
            : 'flex items-center justify-center px-6 py-3 rounded-lg border-2 border-[#1E3A5F] text-[#1E3A5F] font-jakarta text-[15px] font-semibold hover:bg-[#1E3A5F] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A5F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFFBF5] transition-colors min-h-[44px]'
        }
      >
        {tier.cta}
      </Link>
    </motion.div>
  )
}

export default function PricingSection() {
  const [_billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')
  const prefersReduced = useReducedMotion()
  const headingRef = useRef<HTMLDivElement>(null)
  const candidateRef = useRef<HTMLDivElement>(null)
  const employerRef = useRef<HTMLDivElement>(null)

  const headingInView = useInView(headingRef, { once: true, margin: '-80px' })
  const candidateInView = useInView(candidateRef, { once: true, margin: '-80px' })
  const employerInView = useInView(employerRef, { once: true, margin: '-80px' })

  return (
    <section id="pricing" className="py-24 bg-[#F5F0E8]" aria-labelledby="pricing-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          ref={headingRef}
          variants={fadeUp}
          initial="hidden"
          animate={prefersReduced || headingInView ? 'visible' : 'hidden'}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2
            id="pricing-heading"
            className="font-jakarta text-3xl md:text-4xl font-bold text-[#1E3A5F] leading-snug mb-4"
          >
            Start free. Upgrade when you&apos;re ready.
          </h2>
        </motion.div>

        {/* Professional section */}
        <div ref={candidateRef} className="mb-20">
          <div className="flex flex-col items-center mb-10">
            <h3 className="font-jakarta text-2xl font-bold text-[#1E3A5F]">For Professionals</h3>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={prefersReduced || candidateInView ? 'visible' : 'hidden'}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {candidateTiers.map((tier) => (
              <TierCard key={tier.name} tier={tier} />
            ))}
          </motion.div>
        </div>

        {/* Team section */}
        <div ref={employerRef}>
          <div className="flex flex-col items-center mb-10 gap-4">
            <h3 className="font-jakarta text-2xl font-bold text-[#1E3A5F]">For Teams</h3>

            {/* Billing toggle */}
            <div className="flex items-center gap-3">
              <span
                className={`font-inter text-sm font-medium ${_billingCycle === 'monthly' ? 'text-[#1E3A5F]' : 'text-gray-500'}`}
              >
                Monthly
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={_billingCycle === 'annual'}
                aria-label="Toggle between monthly and annual billing"
                onClick={() =>
                  setBillingCycle((c) => (c === 'monthly' ? 'annual' : 'monthly'))
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A5F] focus-visible:ring-offset-2 ${
                  _billingCycle === 'annual' ? 'bg-[#1E3A5F]' : 'bg-[#E8E0D0]'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                    _billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                  aria-hidden="true"
                />
              </button>
              <span
                className={`font-inter text-sm font-medium ${_billingCycle === 'annual' ? 'text-[#1E3A5F]' : 'text-gray-500'}`}
              >
                Annual{' '}
                <span className="font-jakarta text-[12px] font-semibold text-[#D97706]">
                  (save 20%)
                </span>
              </span>
            </div>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={prefersReduced || employerInView ? 'visible' : 'hidden'}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {employerTiers.map((tier) => (
              <TierCard key={tier.name} tier={tier} />
            ))}
          </motion.div>

          <p className="font-inter text-sm text-gray-500 text-center mt-8">
            Rolling out something bigger?{' '}
            <a
              href="#"
              className="text-[#1E3A5F] underline underline-offset-2 hover:text-[#162d4a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A5F] rounded"
            >
              Contact us for details.
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
