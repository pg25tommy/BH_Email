import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
}

export default function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="diner-card rounded-2xl p-4 md:p-6">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs md:text-sm font-semibold text-accent-600 uppercase tracking-wider">{title}</p>
          <p className="text-2xl md:text-3xl font-heading text-primary-600 mt-1">{value}</p>
        </div>
        <div className="text-primary-500 opacity-70 flex-shrink-0 [&>svg]:w-7 [&>svg]:h-7 md:[&>svg]:w-10 md:[&>svg]:h-10">
          {icon}
        </div>
      </div>
    </div>
  );
}
