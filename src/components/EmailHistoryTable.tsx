'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface Recipient {
  id: string;
  status: string;
  subscriber: {
    email: string;
    firstName: string;
    lastName: string | null;
  };
}

interface EmailLog {
  id: string;
  subject: string;
  body: string;
  sentAt: string;
  recipientCount: number;
  recipients: Recipient[];
}

interface EmailHistoryTableProps {
  emails: EmailLog[];
}

export default function EmailHistoryTable({ emails }: EmailHistoryTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (emails.length === 0) {
    return (
      <div className="diner-card rounded-2xl p-6 text-center">
        <p className="text-accent-600">No emails sent yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {emails.map((email) => {
        const isExpanded = expandedId === email.id;
        const sentCount = email.recipients.filter((r) => r.status === 'sent').length;
        const failedCount = email.recipients.filter((r) => r.status === 'failed').length;

        return (
          <div key={email.id} className="diner-card rounded-2xl overflow-hidden">
            <button
              onClick={() => setExpandedId(isExpanded ? null : email.id)}
              className="w-full flex items-center justify-between p-4 md:p-6 text-left hover:bg-primary-50/30 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-accent-900 truncate">{email.subject}</h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-accent-600">
                  <span>
                    {new Date(email.sentAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span>{email.recipientCount} recipients</span>
                  {sentCount > 0 && (
                    <span className="text-green-600">{sentCount} sent</span>
                  )}
                  {failedCount > 0 && (
                    <span className="text-red-600">{failedCount} failed</span>
                  )}
                </div>
              </div>
              {isExpanded ? (
                <ChevronUpIcon className="w-5 h-5 text-accent-500 ml-4 flex-shrink-0" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 text-accent-500 ml-4 flex-shrink-0" />
              )}
            </button>

            {isExpanded && (
              <div className="border-t border-wood-200 p-4 md:p-6">
                {/* Body preview */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-accent-700 uppercase tracking-wider mb-2">
                    Email Content
                  </h4>
                  <div className="border border-wood-200 rounded-lg p-4 bg-white max-h-48 overflow-y-auto">
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: email.body }}
                    />
                  </div>
                </div>

                {/* Recipients */}
                <div>
                  <h4 className="text-sm font-semibold text-accent-700 uppercase tracking-wider mb-2">
                    Recipients
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-wood-200">
                          <th className="text-left py-2 px-2 text-accent-700 font-semibold">Name</th>
                          <th className="text-left py-2 px-2 text-accent-700 font-semibold">Email</th>
                          <th className="text-left py-2 px-2 text-accent-700 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {email.recipients.map((recipient) => (
                          <tr key={recipient.id} className="border-b border-wood-100">
                            <td className="py-2 px-2 text-accent-900">
                              {recipient.subscriber.firstName} {recipient.subscriber.lastName || ''}
                            </td>
                            <td className="py-2 px-2 text-accent-600">{recipient.subscriber.email}</td>
                            <td className="py-2 px-2">
                              <span
                                className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                                  recipient.status === 'sent'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {recipient.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
