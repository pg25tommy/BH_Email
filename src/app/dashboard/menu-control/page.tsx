import { prisma } from '@/lib/prisma';
import StatCard from '@/components/StatCard';
import Link from 'next/link';
import {
  Squares2X2Icon,
  StarIcon,
  XCircleIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

export const dynamic = 'force-dynamic';

export default async function MenuControlPage() {
  const [categoryCount, itemCount, bestSellerCount, soldOutCount, categories] = await Promise.all([
    prisma.category.count({ where: { active: true } }),
    prisma.menuItem.count({ where: { active: true } }),
    prisma.menuItem.count({ where: { bestSeller: true, active: true } }),
    prisma.menuItem.count({ where: { soldOut: true, active: true } }),
    prisma.category.findMany({
      where: { active: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { menuItems: true },
        },
      },
    }),
  ]);

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h1 className="text-3xl md:text-4xl font-heading text-primary-700">
          MENU CONTROL
        </h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard/menu-control/categories"
            className="px-5 py-3 md:px-4 md:py-2 rounded-full bg-wood-200 text-accent-700 hover:bg-wood-300 transition-colors font-semibold text-center"
          >
            Manage Categories
          </Link>
          <Link
            href="/dashboard/menu-control/items"
            className="btn-primary bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold py-3 px-5 md:py-2 md:px-4 rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg text-center"
          >
            Manage Items
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <StatCard
          title="Categories"
          value={categoryCount}
          icon={<TagIcon className="w-10 h-10" />}
        />
        <StatCard
          title="Menu Items"
          value={itemCount}
          icon={<Squares2X2Icon className="w-10 h-10" />}
        />
        <StatCard
          title="Best Sellers"
          value={bestSellerCount}
          icon={<StarIcon className="w-10 h-10" />}
        />
        <StatCard
          title="Sold Out"
          value={soldOutCount}
          icon={<XCircleIcon className="w-10 h-10" />}
        />
      </div>

      <div className="diner-card rounded-2xl p-6">
        <h2 className="text-xl font-heading text-primary-700 mb-4">CATEGORIES OVERVIEW</h2>
        {categories.length === 0 ? (
          <p className="text-accent-600">
            No categories yet.{' '}
            <Link href="/dashboard/menu-control/categories" className="text-primary-600 hover:underline">
              Add your first category
            </Link>{' '}
            to get started.
          </p>
        ) : (
          <>
          {/* Mobile card layout */}
          <div className="md:hidden divide-y divide-wood-100">
            {categories.map((cat) => (
              <div key={cat.id} className="py-3">
                <div className="flex items-center justify-between">
                  <span className="text-accent-900 font-medium">{cat.name}</span>
                  <span className="inline-flex items-center justify-center bg-primary-100 text-primary-700 text-sm font-semibold px-3 py-1 rounded-full">
                    {cat._count.menuItems}
                  </span>
                </div>
                {cat.description && (
                  <p className="text-accent-600 text-sm mt-1">{cat.description}</p>
                )}
              </div>
            ))}
          </div>

          {/* Desktop table layout */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-wood-200">
                  <th className="text-left text-sm font-semibold text-accent-700 uppercase tracking-wider py-3 px-2">
                    Category
                  </th>
                  <th className="text-left text-sm font-semibold text-accent-700 uppercase tracking-wider py-3 px-2">
                    Description
                  </th>
                  <th className="text-center text-sm font-semibold text-accent-700 uppercase tracking-wider py-3 px-2 w-24">
                    Items
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="border-b border-wood-100 hover:bg-primary-50/50 transition-colors"
                  >
                    <td className="py-3 px-2 text-accent-900 font-medium">{cat.name}</td>
                    <td className="py-3 px-2 text-accent-600 text-sm truncate max-w-xs">
                      {cat.description || '—'}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className="inline-flex items-center justify-center bg-primary-100 text-primary-700 text-sm font-semibold px-3 py-1 rounded-full">
                        {cat._count.menuItems}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </>
        )}
      </div>
    </div>
  );
}
