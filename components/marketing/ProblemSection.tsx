'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { fadeUp, staggerContainer } from '@/lib/motion'

export default function ProblemSection() {
  const prefersReduced = useReducedMotion()
  const headingRef = useRef<HTMLDivElement>(null)
  const columnsRef = useRef<HTMLDivElement>(null)
  const closingRef = useRef<HTMLDivElement>(null)

  const headingInView = useInView(headingRef, { once: true, margin: '-80px' })
  const columnsInView = useInView(columnsRef, { once: true, margin: '-80px' })
  const closingInView = useInView(closingRef, { once: true, margin: '-80px' })

  return (
    <section className="py-24 bg-[#FFFBF5]" aria-labelledby="problem-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <motion.div
          ref={headingRef}
          variants={fadeUp}
          initial="hidden"
          animate={prefersReduced || headingInView ? 'visible' : 'hidden'}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2
            id="problem-heading"
            className="font-jakarta text-3xl md:text-4xl font-bold text-[#1E3A5F] leading-snug"
          >
            The business card has not changed in 150 years.
          </h2>
        </motion.div>

        {/* Two-column problem copy */}
        <motion.div
          ref={columnsRef}
          variants={staggerContainer}
          initial="hidden"
          animate={prefersReduced || columnsInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto mb-16"
        >
          <motion.div variants={fadeUp}>
            <h3 className="font-jakarta text-lg font-semibold text-[#1E3A5F] mb-4">
              For you
            </h3>
            <p className="font-inter text-lg text-gray-700 leading-relaxed">
              Your card, your resume, your LinkedIn: a name, a title, a few lines that sound like
              everyone else&apos;s. The moment someone has a real question, the page goes silent,
              and the follow-up never comes.
            </p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h3 className="font-jakarta text-lg font-semibold text-[#1E3A5F] mb-4">
              For whoever&apos;s asking
            </h3>
            <p className="font-inter text-lg text-gray-700 leading-relaxed">
              They wanted the story, the proof, the reason to call. Instead they got a static
              profile that cannot answer a single question. Most people stop digging, and the
              conversation that mattered never happens.
            </p>
          </motion.div>
        </motion.div>

        {/* Closing statement */}
        <motion.div
          ref={closingRef}
          variants={fadeUp}
          initial="hidden"
          animate={prefersReduced || closingInView ? 'visible' : 'hidden'}
          className="text-center"
        >
          <p className="font-jakarta text-2xl md:text-3xl font-bold text-[#1E3A5F]">
            The static profile is dead. We built the one that answers back.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
