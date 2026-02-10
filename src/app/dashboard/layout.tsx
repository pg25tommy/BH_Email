import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 pt-16 md:pt-8 px-4 pb-6 md:px-8 md:pb-8 bg-wood-50 min-h-screen">
        {children}
      </main>
    </div>
  );
}
