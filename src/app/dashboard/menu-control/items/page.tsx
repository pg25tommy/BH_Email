'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/outline';
import MenuItemForm from '@/components/MenuItemForm';
import MenuItemTable from '@/components/MenuItemTable';
import MenuFilterBar from '@/components/MenuFilterBar';
import { Category, MenuItemWithCategory, MenuFilters } from '@/types/menu';

export default function MenuItemsPage() {
  const [items, setItems] = useState<MenuItemWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItemWithCategory | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<MenuFilters>({
    search: '',
    categoryId: '',
    featured: '',
    bestSeller: '',
    soldOut: '',
  });

  const fetchCategories = useCallback(async () => {
    const res = await fetch('/api/menu/categories');
    const data = await res.json();
    setCategories(data.categories);
  }, []);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '50',
        includeInactive: 'true',
      });
      if (filters.search) params.set('search', filters.search);
      if (filters.categoryId) params.set('categoryId', filters.categoryId);
      if (filters.featured) params.set('featured', filters.featured);
      if (filters.bestSeller) params.set('bestSeller', filters.bestSeller);
      if (filters.soldOut) params.set('soldOut', filters.soldOut);

      const res = await fetch(`/api/menu/items?${params}`);
      const data = await res.json();

      setItems(data.items);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setTotal((prev) => prev - 1);
  };

  const handleEdit = (item: MenuItemWithCategory) => {
    setEditingItem(item);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggle = (id: string, field: 'bestSeller' | 'featured' | 'soldOut', value: boolean) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleFormSuccess = () => {
    setEditingItem(null);
    setShowForm(false);
    fetchItems();
  };

  const handleFilterChange = (newFilters: MenuFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/menu-control"
            className="p-2 rounded-full bg-wood-200 text-accent-700 hover:bg-wood-300 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl md:text-4xl font-heading text-primary-700">
            MENU ITEMS
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-accent-600">
            <span className="font-semibold">{total}</span> items
          </span>
          {!showForm && (
            <button
              onClick={() => {
                setEditingItem(null);
                setShowForm(true);
              }}
              className="btn-primary bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold py-2 px-4 rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              Add Item
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <MenuItemForm
          item={editingItem || undefined}
          categories={categories}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setEditingItem(null);
            setShowForm(false);
          }}
        />
      )}

      <MenuFilterBar
        categories={categories}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {loading ? (
        <div className="diner-card rounded-2xl p-6 text-center text-accent-600">
          Loading...
        </div>
      ) : (
        <>
          <MenuItemTable
            items={items}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggle={handleToggle}
          />

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-full bg-wood-200 text-accent-700 hover:bg-wood-300 transition-colors disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-accent-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-full bg-wood-200 text-accent-700 hover:bg-wood-300 transition-colors disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
