'use client';

import { useState, useEffect, useCallback } from 'react';
import EmailHistoryTable from '@/components/EmailHistoryTable';

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

export default function HistoryPage() {
  const [emails, setEmails] = useState<EmailLog[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/emails/history?page=${page}&limit=20`);
      const data = await res.json();
      setEmails(data.emails);
      setTotalPages(data.totalPages);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <div className="animate-fade-in-up">
      <h1 className="text-3xl md:text-4xl font-heading text-primary-700 mb-8">
        EMAIL HISTORY
      </h1>

      {loading ? (
        <div className="diner-card rounded-2xl p-6 text-center text-accent-600">
          Loading...
        </div>
      ) : (
        <>
          <EmailHistoryTable emails={emails} />

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-full bg-wood-200 text-accent-700 hover:bg-wood-300 transition-colors disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-accent-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-full bg-wood-200 text-accent-700 hover:bg-wood-300 transition-colors disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
