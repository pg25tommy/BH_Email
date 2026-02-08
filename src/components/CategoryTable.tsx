'use client';

import { useState } from 'react';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { CategoryWithCount } from '@/types/menu';

interface CategoryTableProps {
  categories: CategoryWithCount[];
  onEdit: (category: CategoryWithCount) => void;
  onDelete: (id: string) => void;
}

export default function CategoryTable({ categories, onEdit, onDelete }: CategoryTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This will also delete all menu items in this category.`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/menu/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onDelete(id);
      }
    } finally {
      setDeletingId(null);
    }
  };

  if (categories.length === 0) {
    return (
      <div className="diner-card rounded-2xl p-6 text-center">
        <p className="text-accent-600">No categories yet. Add your first one above.</p>
      </div>
    );
  }

  return (
    <div className="diner-card rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-wood-200 bg-wood-100/50">
              <th className="text-left text-sm font-semibold text-accent-700 uppercase tracking-wider py-3 px-4">
                Name
              </th>
              <th className="text-left text-sm font-semibold text-accent-700 uppercase tracking-wider py-3 px-4">
                Description
              </th>
              <th className="text-center text-sm font-semibold text-accent-700 uppercase tracking-wider py-3 px-4 w-24">
                Items
              </th>
              <th className="text-center text-sm font-semibold text-accent-700 uppercase tracking-wider py-3 px-4 w-24">
                Order
              </th>
              <th className="text-center text-sm font-semibold text-accent-700 uppercase tracking-wider py-3 px-4 w-24">
                Status
              </th>
              <th className="py-3 px-4 w-24"></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr
                key={cat.id}
                className="border-b border-wood-100 hover:bg-primary-50/50 transition-colors"
              >
                <td className="py-3 px-4 text-accent-900 font-medium">{cat.name}</td>
                <td className="py-3 px-4 text-accent-600 text-sm max-w-xs truncate">
                  {cat.description || '—'}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="inline-flex items-center justify-center bg-primary-100 text-primary-700 text-sm font-semibold px-3 py-1 rounded-full">
                    {cat._count.menuItems}
                  </span>
                </td>
                <td className="py-3 px-4 text-center text-accent-600">{cat.sortOrder}</td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      cat.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {cat.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(cat)}
                      className="text-primary-600 hover:text-primary-800 transition-colors"
                      title="Edit category"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      disabled={deletingId === cat.id}
                      className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                      title="Delete category"
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
