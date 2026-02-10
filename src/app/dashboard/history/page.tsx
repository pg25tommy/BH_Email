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
  const [clearing, setClearing] = useState(false);

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

  const handleClearHistory = async () => {
    if (!confirm('Are you sure you want to delete all email history? This cannot be undone.')) {
      return;
    }

    setClearing(true);
    try {
      const res = await fetch('/api/emails/history', { method: 'DELETE' });
      if (res.ok) {
        setEmails([]);
        setTotalPages(1);
        setPage(1);
      }
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h1 className="text-3xl md:text-4xl font-heading text-primary-700">
          EMAIL HISTORY
        </h1>
        {emails.length > 0 && (
          <button
            onClick={handleClearHistory}
            disabled={clearing}
            className="py-3 px-5 md:py-2 md:px-4 rounded-full border-2 border-red-300 text-red-600 font-semibold hover:bg-red-50 transition-all disabled:opacity-50 w-full sm:w-auto"
          >
            {clearing ? 'Clearing...' : 'Clear History'}
          </button>
        )}
      </div>

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
                className="px-5 py-3 md:px-4 md:py-2 rounded-full bg-wood-200 text-accent-700 hover:bg-wood-300 transition-colors disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-3 md:py-2 text-accent-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-5 py-3 md:px-4 md:py-2 rounded-full bg-wood-200 text-accent-700 hover:bg-wood-300 transition-colors disabled:opacity-50"
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
