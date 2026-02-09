'use client';

import { useState, useEffect } from 'react';
import { Category, MenuItem } from '@/types/menu';

interface MenuItemFormProps {
  item?: MenuItem;
  categories: Category[];
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function MenuItemForm({ item, categories, onSuccess, onCancel }: MenuItemFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [featured, setFeatured] = useState(false);
  const [bestSeller, setBestSeller] = useState(false);
  const [soldOut, setSoldOut] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const isEditing = !!item;

  useEffect(() => {
    if (item) {
      setName(item.name);
      setDescription(item.description || '');
      setPrice(item.price);
      setImage(item.image || '');
      setCategoryId(item.categoryId);
      setFeatured(item.featured);
      setBestSeller(item.bestSeller);
      setSoldOut(item.soldOut);
      setSortOrder(item.sortOrder);
    } else if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [item, categories, categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const url = isEditing ? `/api/menu/items/${item.id}` : '/api/menu/items';
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          isEditing
            ? {
                name,
                description: description || null,
                price: parseFloat(price),
                image: image || null,
                ...(categoryId !== item.categoryId && { categoryId }),
                featured,
                bestSeller,
                soldOut,
                sortOrder,
              }
            : {
                name,
                description: description || undefined,
                price: parseFloat(price),
                image: image || undefined,
                categoryId,
                featured,
                bestSeller,
                soldOut,
                sortOrder,
              }
        ),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to save menu item');
        return;
      }

      setSuccess(isEditing ? 'Menu item updated!' : 'Menu item created!');
      if (!isEditing) {
        setName('');
        setDescription('');
        setPrice('');
        setImage('');
        setFeatured(false);
        setBestSeller(false);
        setSoldOut(false);
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
        {isEditing ? 'EDIT MENU ITEM' : 'ADD MENU ITEM'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-accent-900 mb-1">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-wood-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
              placeholder='e.g., "The Works" Burger'
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-accent-900 mb-1">Category *</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-3 border-2 border-wood-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-accent-900 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border-2 border-wood-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
            placeholder="Item description..."
            rows={2}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="order-1">
            <label className="block text-sm font-semibold text-accent-900 mb-1">Price ($) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-3 border-2 border-wood-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
              placeholder="9.99"
              required
            />
          </div>
          <div className="order-3 md:order-2 col-span-2 md:col-span-1">
            <label className="block text-sm font-semibold text-accent-900 mb-1">Image URL</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-4 py-3 border-2 border-wood-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
              placeholder="/images/menu/item.webp"
            />
          </div>
          <div className="order-2 md:order-3">
            <label className="block text-sm font-semibold text-accent-900 mb-1">Sort Order</label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 border-2 border-wood-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={bestSeller}
              onChange={(e) => setBestSeller(e.target.checked)}
              className="w-5 h-5 accent-primary-600"
            />
            <span className="text-accent-900 font-medium">Best Seller</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-5 h-5 accent-primary-600"
            />
            <span className="text-accent-900 font-medium">Featured</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={soldOut}
              onChange={(e) => setSoldOut(e.target.checked)}
              className="w-5 h-5 accent-red-600"
            />
            <span className="text-accent-900 font-medium">Sold Out</span>
          </label>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold py-3 px-6 rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:hover:scale-100 w-full sm:w-auto"
          >
            {loading ? 'Saving...' : isEditing ? 'Update Item' : 'Add Item'}
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
