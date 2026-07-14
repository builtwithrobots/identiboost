import type { Metadata } from 'next';
import RecruiterHero from '@/components/marketing/RecruiterHero';

export const metadata: Metadata = {
  title: 'For Teams',
  description:
    "Every IdentiBoost professional comes with a verified personal AI your team can question 24/7, plus audio, video, infographic, and deck Boosts behind one link. Know who you're calling before you pick up the phone.",
  alternates: { canonical: '/recruiters' },
  openGraph: {
    url: '/recruiters',
    title: 'IdentiBoost for Teams: talk to a professional’s AI before the first call',
    description:
      'A live personal AI you can question, plus audio, video, infographic, and deck Boosts, all from one link. The first call becomes a confirmation, not an interrogation.',
  },
};

export default function RecruitersPage() {
  return <RecruiterHero />;
}
