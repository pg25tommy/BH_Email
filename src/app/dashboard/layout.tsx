import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-wood-50">
      <Sidebar />
      <main className="md:ml-64 min-h-screen pt-16 md:pt-8 px-4 pb-6 md:px-8 md:pb-8">
        {children}
      </main>
    </div>
  );
}
