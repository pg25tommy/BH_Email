'use client';

import { useState, useRef } from 'react';

interface Subscriber {
  id: string;
  email: string;
  firstName: string;
  lastName: string | null;
}

interface EmailComposerProps {
  subscribers: Subscriber[];
}

export default function EmailComposer({ subscribers }: EmailComposerProps) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sendTo, setSendTo] = useState<'all' | 'selected'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const insertToken = (token: string) => {
    const textarea = bodyRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newBody = body.substring(0, start) + token + body.substring(end);
    setBody(newBody);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + token.length, start + token.length);
    }, 0);
  };

  const toggleSubscriber = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const recipientCount = sendTo === 'all' ? subscribers.length : selectedIds.length;

  const previewBody = body
    .replace(/\{\{firstName\}\}/g, 'John')
    .replace(/\{\{lastName\}\}/g, 'Doe');

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      setResult({ type: 'error', message: 'Subject and body are required' });
      return;
    }

    if (recipientCount === 0) {
      setResult({ type: 'error', message: 'No recipients selected' });
      return;
    }

    if (!confirm(`Are you sure you want to send this email to ${recipientCount} subscriber${recipientCount !== 1 ? 's' : ''}?`)) {
      return;
    }

    setSending(true);
    setResult(null);

    try {
      const res = await fetch('/api/emails/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          body,
          subscriberIds: sendTo === 'selected' ? selectedIds : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setResult({ type: 'error', message: data.error || 'Failed to send' });
        return;
      }

      setResult({
        type: 'success',
        message: `Email sent! ${data.sent} delivered, ${data.failed} failed.`,
      });
      setSubject('');
      setBody('');
    } catch {
      setResult({ type: 'error', message: 'An unexpected error occurred' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Compose */}
      <div className="diner-card rounded-2xl p-6">
        <h2 className="text-xl font-heading text-primary-700 mb-4">COMPOSE</h2>

        {/* Recipients */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-accent-900 mb-2">Recipients</label>
          <div className="flex gap-4 mb-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sendTo"
                checked={sendTo === 'all'}
                onChange={() => setSendTo('all')}
                className="accent-primary-600"
              />
              <span className="text-accent-800">All Subscribers ({subscribers.length})</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sendTo"
                checked={sendTo === 'selected'}
                onChange={() => setSendTo('selected')}
                className="accent-primary-600"
              />
              <span className="text-accent-800">Select Specific</span>
            </label>
          </div>

          {sendTo === 'selected' && (
            <div className="max-h-40 overflow-y-auto border-2 border-wood-200 rounded-lg p-2 bg-white">
              {subscribers.map((sub) => (
                <label
                  key={sub.id}
                  className="flex items-center gap-2 py-1 px-2 hover:bg-primary-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(sub.id)}
                    onChange={() => toggleSubscriber(sub.id)}
                    className="accent-primary-600"
                  />
                  <span className="text-sm text-accent-800">
                    {sub.firstName} {sub.lastName || ''} ({sub.email})
                  </span>
                </label>
              ))}
            </div>
          )}

          <p className="text-sm text-accent-500 mt-1">
            Sending to {recipientCount} subscriber{recipientCount !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Subject */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-accent-900 mb-1">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-3 border-2 border-wood-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
            placeholder="Your email subject line"
          />
        </div>

        {/* Body */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-accent-900 mb-1">Body (HTML)</label>
          <div className="flex gap-2 mb-2">
            <button
              type="button"
              onClick={() => insertToken('{{firstName}}')}
              className="text-xs bg-wood-200 text-accent-700 px-3 py-1 rounded-full hover:bg-wood-300 transition-colors"
            >
              {'{{firstName}}'}
            </button>
            <button
              type="button"
              onClick={() => insertToken('{{lastName}}')}
              className="text-xs bg-wood-200 text-accent-700 px-3 py-1 rounded-full hover:bg-wood-300 transition-colors"
            >
              {'{{lastName}}'}
            </button>
          </div>
          <textarea
            ref={bodyRef}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={12}
            className="w-full px-4 py-3 border-2 border-wood-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none font-mono text-sm"
            placeholder="<h2>Hey {{firstName}}!</h2>&#10;<p>Check out our latest specials...</p>"
          />
          <p className="text-xs text-accent-500 mt-1">
            Use {'{{firstName}}'} and {'{{lastName}}'} for personalization. HTML is supported.
          </p>
        </div>

        {/* Send */}
        <button
          onClick={handleSend}
          disabled={sending || recipientCount === 0}
          className="btn-primary w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold py-3 px-8 rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:hover:scale-100"
        >
          {sending ? 'Sending...' : `Send to ${recipientCount} Subscriber${recipientCount !== 1 ? 's' : ''}`}
        </button>

        {result && (
          <div
            className={`mt-4 p-3 rounded-xl text-sm border-2 ${
              result.type === 'success'
                ? 'bg-green-50 border-green-500 text-green-800'
                : 'bg-red-50 border-red-500 text-red-800'
            }`}
          >
            {result.message}
          </div>
        )}
      </div>

      {/* Preview */}
      <div className="diner-card rounded-2xl p-6">
        <h2 className="text-xl font-heading text-primary-700 mb-4">PREVIEW</h2>
        <div className="border-2 border-wood-200 rounded-lg overflow-hidden bg-white">
          {/* Email header preview */}
          <div style={{ background: 'linear-gradient(135deg, #c19a6b, #a67c52)', padding: '16px', textAlign: 'center' }}>
            <span style={{ color: '#f97316', fontWeight: 'bold', fontSize: '20px', letterSpacing: '2px' }}>
              BURGER HEAVEN
            </span>
          </div>
          {/* Email body preview */}
          <div className="p-6">
            {subject && (
              <p className="text-sm text-accent-500 mb-2">
                <strong>Subject:</strong> {subject}
              </p>
            )}
            {body ? (
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: previewBody }}
              />
            ) : (
              <p className="text-accent-400 italic">Start typing to see a preview...</p>
            )}
          </div>
          {/* Email footer preview */}
          <div style={{ background: '#3d2d1c', padding: '12px', textAlign: 'center', color: '#d4b896', fontSize: '11px' }}>
            Burger Heaven | 77 10th St, New Westminster, BC V3M 3X4
          </div>
        </div>
      </div>
    </div>
  );
}
