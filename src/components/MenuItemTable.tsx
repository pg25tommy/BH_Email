'use client';

import { useState } from 'react';
import { TrashIcon, PencilIcon, StarIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { MenuItemWithCategory } from '@/types/menu';

interface MenuItemTableProps {
  items: MenuItemWithCategory[];
  onEdit: (item: MenuItemWithCategory) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, field: 'bestSeller' | 'featured' | 'soldOut', value: boolean) => void;
}

export default function MenuItemTable({ items, onEdit, onDelete, onToggle }: MenuItemTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/menu/items/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onDelete(id);
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggle = async (id: string, field: 'bestSeller' | 'featured' | 'soldOut', currentValue: boolean) => {
    setTogglingId(id);
    try {
      const res = await fetch(`/api/menu/items/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: !currentValue }),
      });
      if (res.ok) {
        onToggle(id, field, !currentValue);
      }
    } finally {
      setTogglingId(null);
    }
  };

  const formatPrice = (price: string | number) => {
    const num = typeof price === 'string' ? parseFloat(price) : price;
    return `$${num.toFixed(2)}`;
  };

  if (items.length === 0) {
    return (
      <div className="diner-card rounded-2xl p-6 text-center">
        <p className="text-accent-600">No menu items found. Add your first one or adjust filters.</p>
      </div>
    );
  }

  return (
    <div className="diner-card rounded-2xl overflow-hidden">
      {/* Mobile card layout */}
      <div className="md:hidden divide-y divide-wood-100">
        {items.map((item) => (
          <div
            key={item.id}
            className={`p-4 ${item.soldOut ? 'opacity-60' : ''}`}
          >
            <div className="flex items-start gap-3 mb-3">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-accent-900 font-medium">{item.name}</p>
                {item.description && (
                  <p className="text-accent-500 text-sm line-clamp-2">{item.description}</p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-wood-200 text-accent-700">
                    {item.category.name}
                  </span>
                </div>
              </div>
              <span className="text-accent-900 font-semibold text-lg flex-shrink-0">
                {formatPrice(item.price)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggle(item.id, 'bestSeller', item.bestSeller)}
                  disabled={togglingId === item.id}
                  className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition-all ${
                    item.bestSeller
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                  title={item.bestSeller ? 'Remove best seller' : 'Mark as best seller'}
                >
                  {item.bestSeller ? (
                    <StarIconSolid className="w-5 h-5" />
                  ) : (
                    <StarIcon className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => handleToggle(item.id, 'featured', item.featured)}
                  disabled={togglingId === item.id}
                  className={`min-h-[44px] px-3 rounded-full text-xs font-medium transition-all ${
                    item.featured
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {item.featured ? 'Featured' : 'Not Featured'}
                </button>
                <button
                  onClick={() => handleToggle(item.id, 'soldOut', item.soldOut)}
                  disabled={togglingId === item.id}
                  className={`min-h-[44px] flex items-center gap-1 px-3 rounded-full text-xs font-medium transition-all ${
                    item.soldOut
                      ? 'bg-red-100 text-red-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {item.soldOut ? (
                    <>
                      <XCircleIcon className="w-3.5 h-3.5" />
                      <span>Sold Out</span>
                    </>
                  ) : (
                    <span>Available</span>
                  )}
                </button>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit(item)}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-primary-600 hover:bg-primary-50 transition-colors"
                  title="Edit item"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.name)}
                  disabled={deletingId === item.id}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                  title="Delete item"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table layout */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-wood-200 bg-wood-100/50">
              <th className="text-left text-sm font-semibold text-accent-700 uppercase tracking-wider py-3 px-4">
                Name
              </th>
              <th className="text-left text-sm font-semibold text-accent-700 uppercase tracking-wider py-3 px-4">
                Category
              </th>
              <th className="text-right text-sm font-semibold text-accent-700 uppercase tracking-wider py-3 px-4 w-24">
                Price
              </th>
              <th className="text-center text-sm font-semibold text-accent-700 uppercase tracking-wider py-3 px-4 w-28">
                Best Seller
              </th>
              <th className="text-center text-sm font-semibold text-accent-700 uppercase tracking-wider py-3 px-4 w-24">
                Featured
              </th>
              <th className="text-center text-sm font-semibold text-accent-700 uppercase tracking-wider py-3 px-4 w-24">
                Status
              </th>
              <th className="py-3 px-4 w-24"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className={`border-b border-wood-100 hover:bg-primary-50/50 transition-colors ${
                  item.soldOut ? 'opacity-60' : ''
                }`}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                    <div>
                      <p className="text-accent-900 font-medium">{item.name}</p>
                      {item.description && (
                        <p className="text-accent-500 text-sm truncate max-w-xs">{item.description}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-wood-200 text-accent-700">
                    {item.category.name}
                  </span>
                </td>
                <td className="py-3 px-4 text-right text-accent-900 font-semibold">
                  {formatPrice(item.price)}
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => handleToggle(item.id, 'bestSeller', item.bestSeller)}
                    disabled={togglingId === item.id}
                    className={`p-1.5 rounded-full transition-all ${
                      item.bestSeller
                        ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                    title={item.bestSeller ? 'Remove best seller' : 'Mark as best seller'}
                  >
                    {item.bestSeller ? (
                      <StarIconSolid className="w-5 h-5" />
                    ) : (
                      <StarIcon className="w-5 h-5" />
                    )}
                  </button>
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => handleToggle(item.id, 'featured', item.featured)}
                    disabled={togglingId === item.id}
                    className={`px-2 py-1 rounded-full text-xs font-medium transition-all ${
                      item.featured
                        ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {item.featured ? 'Yes' : 'No'}
                  </button>
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => handleToggle(item.id, 'soldOut', item.soldOut)}
                    disabled={togglingId === item.id}
                    className={`flex items-center justify-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all mx-auto ${
                      item.soldOut
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {item.soldOut ? (
                      <>
                        <XCircleIcon className="w-3.5 h-3.5" />
                        <span>Sold Out</span>
                      </>
                    ) : (
                      <span>Available</span>
                    )}
                  </button>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="text-primary-600 hover:text-primary-800 transition-colors"
                      title="Edit item"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.name)}
                      disabled={deletingId === item.id}
                      className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                      title="Delete item"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
