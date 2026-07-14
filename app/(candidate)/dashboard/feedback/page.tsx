import { Inbox } from 'lucide-react';
import DashboardPage from '@/components/layout/DashboardPage';
import PageHeader from '@/components/ui/page-header';
import EmptyState from '@/components/ui/empty-state';

export default function CandidateFeedbackPage() {
  return (
    <DashboardPage className="min-h-full">
      <PageHeader
        title="Feedback"
        description="Notes and feedback that businesses send you after viewing your profile."
      />

      <div className="mx-auto max-w-6xl px-6 py-8">
        <EmptyState
          icon={Inbox}
          title="No feedback yet"
          description="When a business sends feedback through IdentiBoost, it lands here and in your inbox. Share your profile link to get the conversation started."
        />
      </div>
    </DashboardPage>
  );
}
