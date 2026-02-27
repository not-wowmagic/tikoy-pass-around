'use client';

import { useState } from 'react';
import { createTikoy, TikoyData } from '@/lib/storage';

interface TikoyCreatorProps {
  previousTikoy?: TikoyData;
}

export default function TikoyCreator({ previousTikoy }: TikoyCreatorProps) {
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdTikoy, setCreatedTikoy] = useState<TikoyData | null>(null);
  const [copied, setCopied] = useState(false);

  const isPass = !!previousTikoy;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const tikoy = await createTikoy(senderName.trim(), message.trim(), previousTikoy);
      setCreatedTikoy(tikoy);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    const link = window.location.origin + '/tikoy/' + createdTikoy!.id;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (createdTikoy) {
    const shareLink =
      typeof window !== 'undefined'
        ? window.location.origin + '/tikoy/' + createdTikoy.id
        : '';
    return (
      <div className="max-w-lg mx-auto text-center">
        <div className="text-6xl mb-4">🧧</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {isPass ? 'Tikoy passed forward!' : 'Your Tikoy is ready!'}
        </h2>
        <p className="text-gray-500 mb-6 text-sm">
          Share this link. They have{' '}
          <span className="font-semibold text-red-600">24 hours</span> to pass it on!
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
          <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Shareable link</p>
          <p className="text-sm text-gray-700 break-all font-mono">{shareLink}</p>
        </div>
        <button
          onClick={handleCopy}
          className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors mb-3"
        >
          {copied ? '✓ Copied!' : 'Copy Link'}
        </button>
        <div className="mt-5 bg-gradient-to-b from-red-600 to-red-800 rounded-2xl p-5 border-2 border-yellow-400 text-white text-center">
          <p className="text-yellow-300 font-semibold text-sm mb-1">
            {isPass
              ? `Pass #${createdTikoy.passCount} in the chain`
              : 'New Tikoy — start of a chain'}
          </p>
          <p className="text-red-100 text-sm italic">
            &ldquo;{createdTikoy.message.slice(0, 120)}
            {createdTikoy.message.length > 120 ? '…' : ''}&rdquo;
          </p>
          <p className="mt-3 text-yellow-400 text-xs">— {createdTikoy.senderName}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-gradient-to-b from-red-600 to-red-800 rounded-2xl p-6 mb-6 border-4 border-yellow-400 shadow-xl text-white text-center">
        <div className="text-5xl mb-2">🧧</div>
        <p className="text-yellow-300 font-semibold text-lg">
          {isPass
            ? `Passing Forward — Pass #${previousTikoy.passCount + 1}`
            : 'New Virtual Tikoy'}
        </p>
        {message && (
          <p className="mt-3 text-red-100 text-sm italic">
            &ldquo;{message.slice(0, 100)}{message.length > 100 ? '…' : ''}&rdquo;
          </p>
        )}
        <p className="mt-2 text-yellow-400 text-xs">Gong Xi Fa Cai!</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
          <input
            type="text"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            required
            placeholder="e.g. Maria Santos"
            maxLength={60}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lucky Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            placeholder="Wishing you health, wealth, and happiness! Huat ah!"
            rows={4}
            maxLength={300}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none text-gray-900"
          />
          <p className="text-xs text-gray-400 text-right mt-1">{message.length}/300</p>
        </div>
        <button
          type="submit"
          disabled={loading || !senderName.trim() || !message.trim()}
          className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? isPass ? 'Passing...' : 'Creating...'
            : isPass ? 'Pass It Forward 🧧' : 'Create Tikoy 🧧'}
        </button>
        <p className="text-center text-xs text-gray-500">
          You&apos;ll get a shareable link — no sign-up needed.
        </p>
      </form>
    </div>
  );
}
