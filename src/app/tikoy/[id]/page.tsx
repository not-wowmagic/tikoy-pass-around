import Link from 'next/link';
import TikoyViewer from '@/components/tikoy/TikoyViewer';

interface Props { params: Promise<{ id: string }> }

export default async function TikoyPage({ params }: Props) {
  const { id } = await params;
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-700 to-red-900">
      <nav className="flex justify-between items-center px-6 py-4 max-w-3xl mx-auto border-b border-red-600">
        <Link href="/" className="text-yellow-300 font-bold text-xl">Tikoy Pass-Around</Link>
        <Link href="/create-tikoy" className="text-sm text-red-200 hover:text-white">
          Start a new chain →
        </Link>
      </nav>
      <main className="max-w-2xl mx-auto px-6 py-10">
        <TikoyViewer tikoyId={id} />
      </main>
    </div>
  );
}
