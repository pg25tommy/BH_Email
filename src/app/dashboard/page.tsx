import { prisma } from '@/lib/prisma';
import StatCard from '@/components/StatCard';
import { UsersIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const subscriberCount = await prisma.subscriber.count({ where: { active: true } });
  const emailCount = await prisma.emailLog.count();
  const recentEmails = await prisma.emailLog.findMany({
    take: 5,
    orderBy: { sentAt: 'desc' },
  });

  return (
    <div className="animate-fade-in-up">
      <h1 className="text-3xl md:text-4xl font-heading text-primary-700 mb-8">
        DASHBOARD
      </h1>

      <div className="grid grid-cols-2 gap-4 md:gap-6 mb-8">
        <StatCard
          title="Active Subscribers"
          value={subscriberCount}
          icon={<UsersIcon className="w-10 h-10" />}
        />
        <StatCard
          title="Emails Sent"
          value={emailCount}
          icon={<EnvelopeIcon className="w-10 h-10" />}
        />
      </div>

      <div className="diner-card rounded-2xl p-6">
        <h2 className="text-xl font-heading text-primary-700 mb-4">RECENT EMAILS</h2>
        {recentEmails.length === 0 ? (
          <p className="text-accent-600">No emails sent yet. Head to Compose to send your first one.</p>
        ) : (
          <>
            {/* Mobile card layout */}
            <div className="md:hidden divide-y divide-wood-100">
              {recentEmails.map((email) => (
                <div key={email.id} className="py-3">
                  <p className="text-accent-900 font-medium">{email.subject}</p>
                  <div className="flex items-center gap-3 mt-1 text-sm text-accent-600">
                    <span>
                      {new Date(email.sentAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="inline-flex items-center justify-center bg-primary-100 text-primary-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                      {email.recipientCount} recipient{email.recipientCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table layout */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-wood-200">
                    <th className="text-left text-sm font-semibold text-accent-700 uppercase tracking-wider py-3 px-2">
                      Subject
                    </th>
                    <th className="text-left text-sm font-semibold text-accent-700 uppercase tracking-wider py-3 px-2">
                      Sent
                    </th>
                    <th className="text-left text-sm font-semibold text-accent-700 uppercase tracking-wider py-3 px-2">
                      Recipients
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentEmails.map((email) => (
                    <tr key={email.id} className="border-b border-wood-100 hover:bg-primary-50/50 transition-colors">
                      <td className="py-3 px-2 text-accent-900">{email.subject}</td>
                      <td className="py-3 px-2 text-accent-600 text-sm">
                        {new Date(email.sentAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-2 text-accent-600">{email.recipientCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
