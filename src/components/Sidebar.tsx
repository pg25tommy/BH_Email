'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  HomeIcon,
  UsersIcon,
  PencilSquareIcon,
  ClockIcon,
  Bars3Icon,
  XMarkIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import LogoutButton from './LogoutButton';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { href: '/dashboard/menu-control', label: 'Menu Control', icon: Squares2X2Icon },
  { href: '/dashboard/subscribers', label: 'Subscribers', icon: UsersIcon },
  { href: '/dashboard/compose', label: 'Compose Email', icon: PencilSquareIcon },
  { href: '/dashboard/history', label: 'Email History', icon: ClockIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const navContent = (
    <>
      <div className="p-6">
        <h1 className="text-3xl font-heading text-primary-400 tracking-wide">
          BURGER HEAVEN
        </h1>
        <p className="text-wood-200 text-sm mt-1">Email Admin</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                active
                  ? 'bg-white/20 text-white font-semibold'
                  : 'text-wood-100 hover:bg-white/10'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <LogoutButton />
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-wood-700 text-white shadow-lg"
      >
        <Bars3Icon className="w-6 h-6" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-64 wood-panel flex flex-col transform transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 text-wood-200 hover:text-white"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
        {navContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 wood-panel flex-col z-30">
        {navContent}
      </aside>
    </>
  );
}
