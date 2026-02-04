'use client';

import { useState, useEffect, useCallback } from 'react';
import AddSubscriberForm from '@/components/AddSubscriberForm';
import SubscriberTable from '@/components/SubscriberTable';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface Subscriber {
  id: string;
  email: string;
  firstName: string;
  lastName: string | null;
  createdAt: string;
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '50' });
      if (search) params.set('search', search);

      const res = await fetch(`/api/subscribers?${params}`);
      const data = await res.json();

      setSubscribers(data.subscribers);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const handleDelete = (id: string) => {
    setSubscribers((prev) => prev.filter((s) => s.id !== id));
    setSelectedIds((prev) => prev.filter((sid) => sid !== id));
    setTotal((prev) => prev - 1);
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h1 className="text-3xl md:text-4xl font-heading text-primary-700">
          SUBSCRIBERS
        </h1>
        <div className="flex items-center gap-2 text-accent-600">
          <span className="font-semibold">{total}</span> total subscribers
        </div>
      </div>

      <AddSubscriberForm onSuccess={fetchSubscribers} />

      <div className="mb-4">
        <div className="relative max-w-sm">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search subscribers..."
            className="w-full pl-10 pr-4 py-3 border-2 border-wood-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="diner-card rounded-2xl p-6 text-center text-accent-600">
          Loading...
        </div>
      ) : (
        <>
          <SubscriberTable
            subscribers={subscribers}
            onDelete={handleDelete}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
          />

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
