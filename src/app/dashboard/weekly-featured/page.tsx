'use client';

import { useState, useEffect } from 'react';

export default function WeeklyFeaturedPage() {
  const [weekOf, setWeekOf] = useState('');
  const [burgerName, setBurgerName] = useState('');
  const [burgerDescription, setBurgerDescription] = useState('');
  const [burgerPrice, setBurgerPrice] = useState('');
  const [burgerImage, setBurgerImage] = useState('');
  const [sandwichName, setSandwichName] = useState('');
  const [sandwichDescription, setSandwichDescription] = useState('');
  const [sandwichPrice, setSandwichPrice] = useState('');
  const [sandwichImage, setSandwichImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/featured');
        const data = await res.json();

        if (data.burger) {
          setBurgerName(data.burger.name || '');
          setBurgerDescription(data.burger.description || '');
          setBurgerPrice(data.burger.price?.toString() || '');
          setBurgerImage(data.burger.image || '');
        }
        if (data.sandwich) {
          setSandwichName(data.sandwich.name || '');
          setSandwichDescription(data.sandwich.description || '');
          setSandwichPrice(data.sandwich.price?.toString() || '');
          setSandwichImage(data.sandwich.image || '');
        }
        if (data.weekOf) {
          setWeekOf(data.weekOf);
        } else {
          // Default to current Monday
          const today = new Date();
          const day = today.getDay();
          const diff = day === 0 ? -6 : 1 - day;
          const monday = new Date(today);
          monday.setDate(today.getDate() + diff);
          setWeekOf(monday.toISOString().split('T')[0]);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    if (!burgerName || !burgerPrice || !sandwichName || !sandwichPrice || !weekOf) {
      setMessage({ type: 'error', text: 'Please fill in the week date, and name + price for both items.' });
      return;
    }

    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/featured/admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weekOf,
          burgerName,
          burgerDescription,
          burgerPrice,
          burgerImage,
          sandwichName,
          sandwichDescription,
          sandwichPrice,
          sandwichImage,
        }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Weekly featured items saved!' });
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to save.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to save. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-fade-in-up">
        <h1 className="text-3xl md:text-4xl font-heading text-primary-700 mb-8">WEEKLY FEATURED</h1>
        <div className="diner-card rounded-2xl p-6 text-center text-accent-600">Loading...</div>
      </div>
    );
  }

  const inputClass =
    'w-full border-2 border-wood-300 rounded-lg px-4 py-3 md:py-2 text-accent-900 focus:border-primary-400 focus:outline-none bg-white';
  const labelClass = 'block text-sm font-semibold text-accent-700 uppercase tracking-wider mb-1';

  return (
    <div className="animate-fade-in-up max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-3xl md:text-4xl font-heading text-primary-700">WEEKLY FEATURED</h1>
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-accent-700 uppercase tracking-wider">Week Of</label>
          <input
            type="date"
            value={weekOf}
            onChange={(e) => setWeekOf(e.target.value)}
            className="border-2 border-wood-300 rounded-lg px-4 py-3 md:py-2 text-accent-900 focus:border-primary-400 focus:outline-none bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Featured Burger */}
        <div className="diner-card rounded-2xl p-4 md:p-6 space-y-3">
          <h2 className="text-xl md:text-2xl font-heading text-primary-600">FEATURED BURGER</h2>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className={labelClass}>Name</label>
              <input
                type="text"
                value={burgerName}
                onChange={(e) => setBurgerName(e.target.value)}
                placeholder="e.g. The Works Burger"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Price</label>
              <input
                type="number"
                step="0.01"
                value={burgerPrice}
                onChange={(e) => setBurgerPrice(e.target.value)}
                placeholder="25.89"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={burgerDescription}
              onChange={(e) => setBurgerDescription(e.target.value)}
              placeholder="Describe this week's featured burger..."
              rows={2}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Image URL</label>
            <input
              type="text"
              value={burgerImage}
              onChange={(e) => setBurgerImage(e.target.value)}
              placeholder="/images/menu/burgers/example.webp"
              className={inputClass}
            />
          </div>

          {burgerImage && (
            <div className="flex items-center gap-4 p-3 bg-wood-50 rounded-lg border border-wood-200">
              <img
                src={burgerImage}
                alt={burgerName}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="font-semibold text-accent-900 text-sm">{burgerName || 'Untitled'}</p>
                {burgerPrice && <p className="text-sm text-primary-600 font-semibold">${parseFloat(burgerPrice).toFixed(2)}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Featured Sandwich */}
        <div className="diner-card rounded-2xl p-4 md:p-6 space-y-3">
          <h2 className="text-xl md:text-2xl font-heading text-primary-600">FEATURED SANDWICH</h2>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className={labelClass}>Name</label>
              <input
                type="text"
                value={sandwichName}
                onChange={(e) => setSandwichName(e.target.value)}
                placeholder="e.g. BBQ Pulled Pork Sandwich"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Price</label>
              <input
                type="number"
                step="0.01"
                value={sandwichPrice}
                onChange={(e) => setSandwichPrice(e.target.value)}
                placeholder="22.49"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={sandwichDescription}
              onChange={(e) => setSandwichDescription(e.target.value)}
              placeholder="Describe this week's featured sandwich..."
              rows={2}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Image URL</label>
            <input
              type="text"
              value={sandwichImage}
              onChange={(e) => setSandwichImage(e.target.value)}
              placeholder="/images/menu/sandwiches/example.webp"
              className={inputClass}
            />
          </div>

          {sandwichImage && (
            <div className="flex items-center gap-4 p-3 bg-wood-50 rounded-lg border border-wood-200">
              <img
                src={sandwichImage}
                alt={sandwichName}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="font-semibold text-accent-900 text-sm">{sandwichName || 'Untitled'}</p>
                {sandwichPrice && <p className="text-sm text-primary-600 font-semibold">${parseFloat(sandwichPrice).toFixed(2)}</p>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save */}
      <div className="mt-6 flex flex-col sm:flex-row items-start gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 md:py-2 md:px-5 rounded-full transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Featured Items'}
        </button>

        {message && (
          <div
            className={`p-3 rounded-lg text-sm font-medium ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}
