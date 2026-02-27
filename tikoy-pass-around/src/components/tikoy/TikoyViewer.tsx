'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getTikoy, TikoyData } from '@/lib/storage';
import CountdownTimer from './CountdownTimer';

export default function TikoyViewer({ tikoyId }: { tikoyId: string }) {
  const [tikoy, setTikoy] = useState<TikoyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getTikoy(tikoyId).then((data) => {
      if (data) setTikoy(data);
      else setNotFound(true);
      setLoading(false);
    });
  }, [tikoyId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-center">
        <div>
          <div className="text-5xl mb-4 animate-bounce">🧧</div>
          <p className="text-red-200">Loading your Tikoy...</p>
        </div>
      </div>
    );
  }

  if (notFound || !tikoy) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="text-6xl mb-4">😔</div>
        <h2 className="text-2xl font-bold text-white mb-2">Tikoy Not Found</h2>
        <p className="text-red-200 mb-6">This link may have expired or been passed on already.</p>
        <Link
          href="/create-tikoy"
          className="px-6 py-3 bg-yellow-300 text-red-900 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
        >
          Start a new chain
        </Link>
      </div>
    );
  }

  const isExpired = tikoy.status === 'expired' || Date.now() > tikoy.expiresAt;
  const isPassed = tikoy.status === 'passed';

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-gradient-to-b from-red-600 to-red-800 rounded-2xl p-8 mb-6 border-4 border-yellow-400 shadow-2xl text-white text-center">
        <div className="text-6xl mb-3">🧧</div>
        <p className="text-yellow-300 font-bold text-xl mb-1">Gong Xi Fa Cai!</p>
        <p className="text-red-200 text-xs mb-5">Pass #{tikoy.passCount} in the chain</p>
        <div className="bg-red-900/40 rounded-xl p-5 mb-4">
          <p className="text-white leading-relaxed text-sm italic">&ldquo;{tikoy.message}&rdquo;</p>
          <p className="mt-4 text-yellow-400 text-sm font-semibold">— {tikoy.senderName}</p>
        </div>
      </div>

      {isExpired ? (
        <div className="bg-gray-100 border border-gray-300 rounded-xl p-5 mb-5 text-center">
          <p className="text-gray-500 font-semibold">This Tikoy has expired.</p>
          <p className="text-gray-400 text-sm mt-1">The luck was not passed on in time.</p>
        </div>
      ) : isPassed ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-5 text-center">
          <p className="text-green-700 font-semibold">✓ This Tikoy has been passed on!</p>
          <p className="text-green-600 text-sm mt-1">The luck continues through the chain.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-5 mb-5 shadow text-center">
          <p className="text-gray-600 text-sm mb-2 font-medium">Time left to pass it forward</p>
          <CountdownTimer expiresAt={tikoy.expiresAt} />
        </div>
      )}

      <div className="bg-white/10 rounded-xl p-4 mb-5 flex items-center justify-between text-sm">
        <span className="text-red-200">Chain ID</span>
        <span className="text-yellow-300 font-mono text-xs">{tikoy.chainId.slice(0, 12)}…</span>
      </div>

      {!isExpired && !isPassed && (
        <Link
          href={`/pass-tikoy/${tikoy.id}`}
          className="block w-full py-4 text-center bg-yellow-400 text-red-900 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-colors shadow-lg"
        >
          Pass It Forward 🧧
        </Link>
      )}

      <div className="mt-4 text-center">
        <Link href="/" className="text-red-300 text-sm hover:text-white">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
