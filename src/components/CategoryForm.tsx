'use client';

import { useState, useEffect } from 'react';
import { Category } from '@/types/menu';

interface CategoryFormProps {
  category?: Category;
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function CategoryForm({ category, onSuccess, onCancel }: CategoryFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const isEditing = !!category;

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description || '');
      setSortOrder(category.sortOrder);
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const url = isEditing ? `/api/menu/categories/${category.id}` : '/api/menu/categories';
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description: description || undefined, sortOrder }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to save category');
        return;
      }

      setSuccess(isEditing ? 'Category updated!' : 'Category created!');
      if (!isEditing) {
        setName('');
        setDescription('');
        setSortOrder(0);
      }
      onSuccess();
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="diner-card rounded-2xl p-6 mb-6">
      <h2 className="text-xl font-heading text-primary-700 mb-4">
        {isEditing ? 'EDIT CATEGORY' : 'ADD CATEGORY'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-3 md:flex md:flex-row gap-4">
          <div className="col-span-2 md:flex-1">
            <label className="block text-sm font-semibold text-accent-900 mb-1">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-wood-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
              placeholder="e.g., Burgers"
              required
            />
          </div>
          <div className="col-span-1 md:w-32">
            <label className="block text-sm font-semibold text-accent-900 mb-1">Sort Order</label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 border-2 border-wood-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-accent-900 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border-2 border-wood-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
            placeholder="Optional category description..."
            rows={2}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold py-3 px-6 rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:hover:scale-100 w-full sm:w-auto"
          >
            {loading ? 'Saving...' : isEditing ? 'Update Category' : 'Add Category'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="py-3 px-6 rounded-full border-2 border-wood-300 text-accent-700 font-semibold hover:bg-wood-100 transition-all w-full sm:w-auto"
            >
              Cancel
            </button>
          )}
        </div>
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
