'use client';

import { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

interface Subscriber {
  id: string;
  email: string;
  firstName: string;
  lastName: string | null;
  createdAt: string;
}

interface SubscriberTableProps {
  subscribers: Subscriber[];
  onDelete: (id: string) => void;
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

export default function SubscriberTable({
  subscribers,
  onDelete,
  selectedIds,
  onSelectionChange,
}: SubscriberTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleSelectAll = () => {
    if (selectedIds.length === subscribers.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(subscribers.map((s) => s.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((sid) => sid !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/subscribers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onDelete(id);
      }
    } finally {
      setDeletingId(null);
    }
  };

  if (subscribers.length === 0) {
    return (
      <div className="diner-card rounded-2xl p-6 text-center">
        <p className="text-accent-600">No subscribers yet. Add your first one above.</p>
      </div>
    );
  }

  return (
    <div className="diner-card rounded-2xl overflow-hidden">
      {/* Mobile card layout */}
      <div className="md:hidden divide-y divide-wood-100">
        <div className="p-3 flex items-center gap-3 bg-wood-100/50">
          <input
            type="checkbox"
            checked={selectedIds.length === subscribers.length}
            onChange={toggleSelectAll}
            className="w-5 h-5 accent-primary-600"
          />
          <span className="text-sm font-semibold text-accent-700">Select All</span>
        </div>
        {subscribers.map((sub) => (
          <div key={sub.id} className="p-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={selectedIds.includes(sub.id)}
                onChange={() => toggleSelect(sub.id)}
                className="w-5 h-5 accent-primary-600 mt-0.5 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-accent-900 font-medium">{sub.firstName} {sub.lastName || ''}</p>
                <p className="text-accent-600 text-sm truncate">{sub.email}</p>
                <p className="text-accent-500 text-xs mt-1">
                  Added {new Date(sub.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <button
                onClick={() => handleDelete(sub.id, sub.firstName)}
                disabled={deletingId === sub.id}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 flex-shrink-0"
                title="Delete subscriber"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table layout */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-wood-200 bg-wood-100/50">
              <th className="py-3 px-4 w-10">
                <input
                  type="checkbox"
                  checked={selectedIds.length === subscribers.length}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 accent-primary-600"
                />
              </th>
              <th className="text-left text-sm font-semibold text-accent-700 uppercase tracking-wider py-3 px-4">
                Email
              </th>
              <th className="text-left text-sm font-semibold text-accent-700 uppercase tracking-wider py-3 px-4">
                First Name
              </th>
              <th className="text-left text-sm font-semibold text-accent-700 uppercase tracking-wider py-3 px-4">
                Last Name
              </th>
              <th className="text-left text-sm font-semibold text-accent-700 uppercase tracking-wider py-3 px-4">
                Added
              </th>
              <th className="py-3 px-4 w-16"></th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((sub) => (
              <tr
                key={sub.id}
                className="border-b border-wood-100 hover:bg-primary-50/50 transition-colors"
              >
                <td className="py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(sub.id)}
                    onChange={() => toggleSelect(sub.id)}
                    className="w-4 h-4 accent-primary-600"
                  />
                </td>
                <td className="py-3 px-4 text-accent-900">{sub.email}</td>
                <td className="py-3 px-4 text-accent-900">{sub.firstName}</td>
                <td className="py-3 px-4 text-accent-600">{sub.lastName || '—'}</td>
                <td className="py-3 px-4 text-accent-600 text-sm">
                  {new Date(sub.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleDelete(sub.id, sub.firstName)}
                    disabled={deletingId === sub.id}
                    className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                    title="Delete subscriber"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
