import { permanentRedirect } from 'next/navigation';

// Legacy public-profile URL. Calling cards shipped at /c/[slug] before the
// IdentiBoost pivot moved them to /i/[slug]. This route exists only so old
// links, QR codes, and email signatures keep working; it must stay in the
// middleware public-route list so signed-out visitors reach the redirect.
export default async function LegacyCallingCardRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  permanentRedirect(`/i/${slug}`);
}
