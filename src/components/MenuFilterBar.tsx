'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Category, MenuFilters } from '@/types/menu';

interface MenuFilterBarProps {
  categories: Category[];
  filters: MenuFilters;
  onFilterChange: (filters: MenuFilters) => void;
}

export default function MenuFilterBar({ categories, filters, onFilterChange }: MenuFilterBarProps) {
  const updateFilter = (key: keyof MenuFilters, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="diner-card rounded-2xl p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent-400" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-2 border-wood-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={filters.categoryId}
            onChange={(e) => updateFilter('categoryId', e.target.value)}
            className="px-4 py-2 border-2 border-wood-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={filters.bestSeller}
            onChange={(e) => updateFilter('bestSeller', e.target.value)}
            className="px-4 py-2 border-2 border-wood-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
          >
            <option value="">All Items</option>
            <option value="true">Best Sellers</option>
            <option value="false">Not Best Sellers</option>
          </select>

          <select
            value={filters.soldOut}
            onChange={(e) => updateFilter('soldOut', e.target.value)}
            className="px-4 py-2 border-2 border-wood-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
          >
            <option value="">Any Availability</option>
            <option value="false">Available</option>
            <option value="true">Sold Out</option>
          </select>

          <select
            value={filters.featured}
            onChange={(e) => updateFilter('featured', e.target.value)}
            className="px-4 py-2 border-2 border-wood-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
          >
            <option value="">Any Featured</option>
            <option value="true">Featured</option>
            <option value="false">Not Featured</option>
          </select>
        </div>
      </div>
    </div>
  );
}
