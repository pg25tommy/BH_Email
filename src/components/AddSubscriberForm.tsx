'use client';

import { useState } from 'react';

interface AddSubscriberFormProps {
  onSuccess: () => void;
}

export default function AddSubscriberForm({ onSuccess }: AddSubscriberFormProps) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName, lastName: lastName || undefined }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to add subscriber');
        return;
      }

      setSuccess(`${firstName} added successfully!`);
      setEmail('');
      setFirstName('');
      setLastName('');
      onSuccess();
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="diner-card rounded-2xl p-6 mb-6">
      <h2 className="text-xl font-heading text-primary-700 mb-4">ADD SUBSCRIBER</h2>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block text-sm font-semibold text-accent-900 mb-1">Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border-2 border-wood-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
            placeholder="email@example.com"
            required
          />
        </div>
        <div className="flex-1 w-full">
          <label className="block text-sm font-semibold text-accent-900 mb-1">First Name *</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-4 py-3 border-2 border-wood-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
            placeholder="John"
            required
          />
        </div>
        <div className="flex-1 w-full">
          <label className="block text-sm font-semibold text-accent-900 mb-1">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-4 py-3 border-2 border-wood-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
            placeholder="Doe"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold py-3 px-6 rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:hover:scale-100 whitespace-nowrap w-full md:w-auto"
        >
          {loading ? 'Adding...' : 'Add Subscriber'}
        </button>
      </form>

      {error && (
        <div className="mt-4 bg-red-50 border-2 border-red-500 text-red-800 p-3 rounded-xl text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-4 bg-green-50 border-2 border-green-500 text-green-800 p-3 rounded-xl text-sm">
          {success}
        </div>
      )}
    </div>
  );
}
