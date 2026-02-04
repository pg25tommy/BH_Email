'use client';

import { useState, useEffect } from 'react';
import EmailComposer from '@/components/EmailComposer';

interface Subscriber {
  id: string;
  email: string;
  firstName: string;
  lastName: string | null;
}

export default function ComposePage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const res = await fetch('/api/subscribers?limit=100');
        const data = await res.json();
        setSubscribers(data.subscribers);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscribers();
  }, []);

  return (
    <div className="animate-fade-in-up">
      <h1 className="text-3xl md:text-4xl font-heading text-primary-700 mb-8">
        COMPOSE EMAIL
      </h1>

      {loading ? (
        <div className="diner-card rounded-2xl p-6 text-center text-accent-600">
          Loading subscribers...
        </div>
      ) : subscribers.length === 0 ? (
        <div className="diner-card rounded-2xl p-6 text-center text-accent-600">
          No subscribers yet. Add some in the Subscribers page first.
        </div>
      ) : (
        <EmailComposer subscribers={subscribers} />
      )}
    </div>
  );
}
