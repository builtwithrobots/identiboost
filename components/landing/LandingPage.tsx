import Link from 'next/link';
import IdentiBoostLogo from '@/components/layout/IdentiBoostLogo';
import { Mic2, Bot, BarChart3, Share2, CheckCircle, ArrowRight, Zap, Sparkles } from 'lucide-react';

function Header() {
  return (
    <header className="sticky top-0 z-[--z-sticky] border-b border-[--rb-border] bg-[--rb-bg-surface]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <IdentiBoostLogo />
        <nav className="hidden items-center gap-8 md:flex">
          {['#features', '#how-it-works', '#pricing'].map((href, i) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-[--rb-text-secondary] transition-colors hover:text-[--rb-text]"
            >
              {['Features', 'How it works', 'Pricing'][i]}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="rounded-[--radius-md] px-4 py-2 text-sm font-semibold text-[--rb-text-secondary] transition-colors hover:bg-[--rb-bg-surface-raised] hover:text-[--rb-text]"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-1.5 rounded-[--radius-md] bg-[--rb-brand] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[--rb-brand-hover] hover:shadow-md active:scale-[0.98]"
          >
            Get started
            <ArrowRight className="size-3.5" strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden py-28 sm:py-36 lg:py-44">
      {/* Dot grid */}
      <div className="rb-dot-grid pointer-events-none absolute inset-0 -z-10 opacity-60" />

      {/* Gradient orbs, larger and more colourful */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-120px] h-[700px] w-[1100px] -translate-x-1/2 rounded-full bg-[--rb-brand-subtle] opacity-80 blur-[140px]" />
        <div className="absolute right-[-80px] top-[60px] h-[380px] w-[500px] rounded-full bg-violet-200 opacity-50 blur-[90px]" />
        <div className="absolute bottom-[-60px] left-[-60px] h-[320px] w-[400px] rounded-full bg-cyan-100 opacity-40 blur-[80px]" />
      </div>

      <div className="mx-auto max-w-4xl px-6 text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[--rb-border-brand] bg-[--rb-brand-subtle] px-4 py-1.5 shadow-sm">
          <Sparkles className="size-3.5 text-[--rb-brand]" strokeWidth={2.5} />
          <span className="rb-section-label text-[--rb-text-brand]">The universal professional presence platform</span>
        </div>

        {/* Headline */}
        <h1 className="mb-6 font-display text-5xl font-extrabold leading-[1.08] tracking-tight text-[--rb-text] sm:text-6xl lg:text-[5.5rem]">
          Your identity.
          <br />
          <span className="gradient-text">Boosted.</span>
        </h1>

        {/* Subtext */}
        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-[--rb-text-secondary] sm:text-xl">
          Tell your story once. Get a verified personal AI that represents you 24/7 to anyone who asks, audio, video, deck, resume, and a live chatbot behind one link, with every conversation delivered to both sides.
        </p>

        {/* CTA row */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/sign-up" className="rb-btn-primary w-full sm:w-auto">
            Get started for free
            <ArrowRight className="size-4" strokeWidth={2.5} />
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex w-full items-center justify-center rounded-[--radius-md] border border-[--rb-border-strong] bg-[--rb-bg-surface] px-8 py-3.5 text-base font-semibold text-[--rb-text] transition-all hover:border-[--rb-text-muted] hover:bg-[--rb-bg-surface-raised] active:scale-[0.98] sm:w-auto"
          >
            Sign in
          </Link>
        </div>

        <p className="mt-5 text-sm text-[--rb-text-muted]">Free to start · No credit card required</p>

        {/* Social proof strip */}
        <div className="mt-12 flex items-center justify-center gap-2">
          {/* Avatar stack */}
          <div className="flex -space-x-2">
            {['4338CA', '7C3AED', '0E7490', 'B45309'].map((hex, i) => (
              <div
                key={i}
                className="size-8 rounded-full border-2 border-[--rb-bg-page] shadow-sm"
                style={{ background: `#${hex}` }}
                aria-hidden="true"
              />
            ))}
          </div>
          <p className="text-sm text-[--rb-text-secondary]">
            <span className="font-semibold text-[--rb-text]">2,400+</span> professionals already boosted
          </p>
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    icon: Mic2,
    iconClass: 'rb-icon-indigo',
    title: 'Multi-format professional story',
    description: 'Audio overview, debate clips, video intro, slide deck, infographic, and ATS resume, all living behind one shareable link.',
  },
  {
    icon: Bot,
    iconClass: 'rb-icon-violet',
    title: 'Your Identity AI',
    description: 'A Claude-powered chatbot trained on your professional data answers questions from anyone around the clock, with every conversation emailed to both sides.',
  },
  {
    icon: Share2,
    iconClass: 'rb-icon-cyan',
    title: 'One link, everything',
    description: 'Share a single URL or QR code. Whoever opens it gets your full professional story in the format they prefer, no attachments, no scheduling friction.',
  },
  {
    icon: BarChart3,
    iconClass: 'rb-icon-amber',
    title: "Know who's interested",
    description: 'See who viewed your profile, how long they stayed, and which assets they engaged with. Fine-tune your AI based on what people actually ask.',
  },
];

function Features() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <p className="rb-section-label mb-3">Everything you need</p>
          <h2 className="mb-4 font-display text-3xl font-extrabold tracking-tight text-[--rb-text] sm:text-4xl">
            Stand out before the first meeting
          </h2>
          <p className="mx-auto max-w-2xl text-[--rb-text-secondary]">
            The business card has not changed in 150 years. IdentiBoost is the first one that answers back.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rb-card group flex flex-col gap-4 p-6 transition-all duration-[--duration-base] hover:-translate-y-1 hover:shadow-[--shadow-card-hover]"
            >
              <div
                className={`inline-flex size-12 items-center justify-center rounded-[--radius-lg] ${f.iconClass} transition-transform duration-[--duration-base] group-hover:scale-110`}
              >
                <f.icon className="size-5.5" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="mb-1.5 font-display text-base font-semibold text-[--rb-text]">{f.title}</h3>
                <p className="text-sm leading-relaxed text-[--rb-text-secondary]">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  { step: '01', title: 'Create your profile', body: 'Add your professional context, upload your NotebookLM-produced audio, video, deck, and resume.' },
  { step: '02', title: 'Get your link', body: 'Share one URL or QR code with anyone: a prospect, a client, an event organizer, a hiring manager.' },
  { step: '03', title: 'Your AI does the work', body: 'Anyone can chat with your AI anytime. You receive a full transcript of every conversation.' },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden border-t border-[--rb-border] bg-[--rb-bg-surface] py-24">
      {/* Faint gradient wash */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-0 h-[400px] w-[600px] rounded-full bg-[--rb-brand-subtle] opacity-40 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6">
        <div className="mb-16 text-center">
          <p className="rb-section-label mb-3">Simple process</p>
          <h2 className="mb-4 font-display text-3xl font-extrabold tracking-tight text-[--rb-text] sm:text-4xl">
            How it works
          </h2>
          <p className="text-[--rb-text-secondary]">Up and running in under an hour.</p>
        </div>

        <div className="space-y-0">
          {steps.map((s, i) => (
            <div key={s.step} className="flex gap-6">
              <div className="flex shrink-0 flex-col items-center">
                <div
                  className="rb-glow flex size-12 items-center justify-center rounded-full font-data text-sm font-bold text-white"
                  style={{ background: 'var(--rb-brand-gradient)' }}
                  aria-hidden="true"
                >
                  {i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className="my-1.5 w-px grow bg-gradient-to-b from-[--rb-brand]/50 to-[--rb-border]" />
                )}
              </div>
              <div className="pb-12">
                <p className="rb-section-label mb-1 text-[--rb-text-muted]">{s.step}</p>
                <h3 className="mb-2 font-display text-lg font-semibold text-[--rb-text]">{s.title}</h3>
                <p className="text-[--rb-text-secondary]">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

type PricingTier = {
  name: string;
  price: string;
  period: string;
  blurb: string;
  features: string[];
  cta: string;
  featured?: boolean;
};

const professionalTiers: PricingTier[] = [
  {
    name: 'Starter',
    price: 'Free',
    period: '',
    blurb: 'Everything you need to answer back.',
    features: [
      'Your professional profile',
      'Shareable link and QR code',
      'Basic Identity AI chat',
      'Transcript delivery after every conversation',
    ],
    cta: 'Create your profile',
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/ month',
    blurb: 'For professionals whose link works hard.',
    features: [
      'Everything in Starter',
      'Embed widget (coming soon)',
      'Conversation analytics',
      'Custom Q&A',
      'AI fine-tuning',
    ],
    cta: 'Go Pro',
    featured: true,
  },
  {
    name: 'Business',
    price: '$99',
    period: '/ month',
    blurb: 'When your AI is part of your pipeline.',
    features: [
      'Everything in Pro',
      'CRM export (coming soon)',
      'Advanced analytics',
      'Priority support',
    ],
    cta: 'Get Business',
  },
];

const teamTiers: PricingTier[] = [
  {
    name: 'Team',
    price: '$299',
    period: '/ month',
    blurb: 'Put your whole team behind one AI layer.',
    features: ['Up to 10 profiles', 'Company AI layer', 'Aggregate analytics'],
    cta: 'Start with Team',
  },
  {
    name: 'Growth',
    price: '$699',
    period: '/ month',
    blurb: 'For teams scaling their presence.',
    features: ['Up to 25 profiles', 'Everything in Team', 'CRM integration (coming soon)'],
    cta: 'Start with Growth',
    featured: true,
  },
  {
    name: 'Scale',
    price: '$1,499',
    period: '/ month',
    blurb: 'Your brand, on every profile.',
    features: ['Unlimited profiles', 'White label', 'Dedicated onboarding'],
    cta: 'Talk to us',
  },
];

function PricingCard({ tier }: { tier: PricingTier }) {
  if (tier.featured) {
    return (
      <div className="rb-card rb-card-featured relative flex flex-col overflow-hidden p-8">
        {/* Interior gradient wash */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[--rb-brand-subtle]/70 via-transparent to-violet-50/40" />

        <div className="relative mb-6">
          <span className="rb-badge mb-3 bg-[--rb-brand] text-white">
            <Zap className="size-3" strokeWidth={2.5} />
            Most popular
          </span>
          <p className="rb-section-label mb-1 text-[--rb-text-muted]">{tier.name}</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-display text-5xl font-extrabold tracking-tight text-[--rb-text]">{tier.price}</span>
            {tier.period && <span className="text-[--rb-text-muted]">{tier.period}</span>}
          </div>
          <p className="mt-2 text-sm text-[--rb-text-secondary]">{tier.blurb}</p>
        </div>

        <ul className="relative mb-8 grow space-y-3">
          {tier.features.map((f) => (
            <li key={f} className="flex items-center gap-3 text-sm text-[--rb-text-secondary]">
              <CheckCircle className="size-4 shrink-0 text-[--rb-brand]" strokeWidth={2} />
              {f}
            </li>
          ))}
        </ul>

        <Link href="/sign-up" className="relative rb-btn-primary w-full">
          {tier.cta}
          <ArrowRight className="size-4" strokeWidth={2.5} />
        </Link>
      </div>
    );
  }

  return (
    <div className="rb-card flex flex-col p-8">
      <div className="mb-6">
        <p className="rb-section-label mb-1 text-[--rb-text-muted]">{tier.name}</p>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="font-display text-5xl font-extrabold tracking-tight text-[--rb-text]">{tier.price}</span>
          {tier.period && <span className="text-[--rb-text-muted]">{tier.period}</span>}
        </div>
        <p className="mt-2 text-sm text-[--rb-text-secondary]">{tier.blurb}</p>
      </div>
      <ul className="mb-8 grow space-y-3">
        {tier.features.map((f) => (
          <li key={f} className="flex items-center gap-3 text-sm text-[--rb-text-secondary]">
            <CheckCircle className="size-4 shrink-0 text-[--color-success]" strokeWidth={2} />
            {f}
          </li>
        ))}
      </ul>
      <Link
        href="/sign-up"
        className="block w-full rounded-[--radius-md] border border-[--rb-border-strong] px-6 py-3 text-center text-sm font-semibold text-[--rb-text] transition-all hover:border-[--rb-text-muted] hover:bg-[--rb-bg-surface-raised] active:scale-[0.98]"
      >
        {tier.cta}
      </Link>
    </div>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <p className="rb-section-label mb-3">Pricing</p>
          <h2 className="mb-4 font-display text-3xl font-extrabold tracking-tight text-[--rb-text] sm:text-4xl">
            Start free. Upgrade when you&apos;re ready.
          </h2>
          <p className="text-[--rb-text-secondary]">Every professional starts free. Bring your whole team when it&apos;s time.</p>
        </div>

        <div className="mb-16">
          <h3 className="mb-8 text-center font-display text-xl font-bold text-[--rb-text]">For Professionals</h3>
          <div className="grid gap-8 md:grid-cols-3">
            {professionalTiers.map((tier) => (
              <PricingCard key={tier.name} tier={tier} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-8 text-center font-display text-xl font-bold text-[--rb-text]">For Teams</h3>
          <div className="grid gap-8 md:grid-cols-3">
            {teamTiers.map((tier) => (
              <PricingCard key={tier.name} tier={tier} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="rb-section-dark relative overflow-hidden py-28">
      {/* Orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-[-60px] h-[400px] w-[600px] rounded-full bg-violet-600 opacity-20 blur-[120px]" />
        <div className="absolute right-1/4 bottom-[-60px] h-[300px] w-[500px] rounded-full bg-cyan-500 opacity-15 blur-[100px]" />
      </div>
      {/* Dot grid on dark */}
      <div className="pointer-events-none absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, rgb(255 255 255 / 0.12) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <p className="rb-section-label mb-4 text-violet-300">Get started today</p>
        <h2 className="mb-5 font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
          Ready to answer back?
        </h2>
        <p className="mb-10 text-lg text-violet-200/80">
          Join professionals who give whoever&apos;s asking everything they need, in minutes.
        </p>
        <Link
          href="/sign-up"
          className="inline-flex items-center gap-2 rounded-[--radius-md] bg-white px-10 py-4 text-base font-semibold text-[--rb-brand] shadow-[0_4px_24px_rgb(0_0_0_/_0.25)] transition-all hover:bg-violet-50 hover:shadow-[0_8px_32px_rgb(0_0_0_/_0.30)] active:scale-[0.98]"
        >
          Get started for free
          <ArrowRight className="size-4" strokeWidth={2.5} />
        </Link>
        <p className="mt-5 text-sm text-violet-300/70">No credit card required · Takes less than 5 minutes</p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[--rb-border] bg-[--rb-bg-surface]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div>
            <IdentiBoostLogo />
            <p className="mt-2 max-w-xs text-sm text-[--rb-text-muted]">
              The universal professional presence platform.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {[
              { href: '/sign-in', label: 'Sign in' },
              { href: '/sign-up', label: 'Get started' },
              { href: '#features', label: 'Features' },
              { href: '#how-it-works', label: 'How it works' },
              { href: '#pricing', label: 'Pricing' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[--rb-text-secondary] transition-colors hover:text-[--rb-text]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-10 border-t border-[--rb-border] pt-6 text-sm text-[--rb-text-muted]">
          © {new Date().getFullYear()} IdentiBoost. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[--rb-bg-page]">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
