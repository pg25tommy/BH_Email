'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import CategoryForm from '@/components/CategoryForm';
import CategoryTable from '@/components/CategoryTable';
import { CategoryWithCount } from '@/types/menu';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [editingCategory, setEditingCategory] = useState<CategoryWithCount | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/menu/categories?includeInactive=true');
      const data = await res.json();
      setCategories(data.categories);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const handleEdit = (category: CategoryWithCount) => {
    setEditingCategory(category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormSuccess = () => {
    setEditingCategory(null);
    fetchCategories();
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard/menu-control"
          className="p-3 md:p-2 rounded-full bg-wood-200 text-accent-700 hover:bg-wood-300 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl md:text-4xl font-heading text-primary-700">
          CATEGORIES
        </h1>
      </div>

      <CategoryForm
        category={editingCategory || undefined}
        onSuccess={handleFormSuccess}
        onCancel={editingCategory ? () => setEditingCategory(null) : undefined}
      />

      {loading ? (
        <div className="diner-card rounded-2xl p-6 text-center text-accent-600">
          Loading...
        </div>
      ) : (
        <CategoryTable
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
