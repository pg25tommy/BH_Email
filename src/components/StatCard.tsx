import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
}

export default function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="diner-card rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-accent-600 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-heading text-primary-600 mt-1">{value}</p>
        </div>
        <div className="text-primary-500 opacity-70">
          {icon}
        </div>
      </div>
    </div>
  );
}
