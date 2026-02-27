'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getTikoy, TikoyData } from '@/lib/storage';
import TikoyCreator from '@/components/tikoy/TikoyCreator';

export default function PassTikoyPage() {
  const params = useParams();
  const tikoyId = params.id as string;
  const [tikoy, setTikoy] = useState<TikoyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTikoy(tikoyId).then((data) => {
      if (!data) setError('Tikoy not found.');
      else if (data.status === 'passed') setError('This Tikoy has already been passed on.');
      else if (data.status === 'expired' || Date.now() > data.expiresAt)
        setError('This Tikoy has expired. The chain has ended.');
      else setTikoy(data);
      setLoading(false);
    });
  }, [tikoyId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-700 to-red-900">
      <nav className="flex justify-between items-center px-6 py-4 max-w-3xl mx-auto border-b border-red-600">
        <a href="/" className="text-yellow-300 font-bold text-xl">Tikoy Pass-Around</a>
        <Link href={`/tikoy/${tikoyId}`} className="text-sm text-red-200 hover:text-white">
          ← Back to Tikoy
        </Link>
      </nav>
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-white text-center mb-2">Pass It Forward</h1>
        <p className="text-red-200 text-center mb-8 text-sm">
          Add your lucky message and keep the chain alive!
        </p>

        {loading && (
          <div className="text-center">
            <div className="text-5xl mb-4 animate-bounce">🧧</div>
            <p className="text-red-200">Loading...</p>
          </div>
        )}

        {error && (
          <div className="bg-white rounded-2xl p-8 text-center shadow-xl">
            <div className="text-5xl mb-4">😔</div>
            <p className="text-gray-700 font-semibold mb-4">{error}</p>
            <Link
              href="/create-tikoy"
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Start a new chain
            </Link>
          </div>
        )}

        {!loading && !error && tikoy && (
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-xs text-red-400 uppercase tracking-wide mb-1 font-medium">
                You received from
              </p>
              <p className="text-gray-800 font-semibold">{tikoy.senderName}</p>
              <p className="text-gray-600 text-sm italic mt-1">
                &ldquo;{tikoy.message.slice(0, 100)}{tikoy.message.length > 100 ? '…' : ''}&rdquo;
              </p>
            </div>
            <TikoyCreator previousTikoy={tikoy} />
          </div>
        )}
      </main>
    </div>
  );
}
