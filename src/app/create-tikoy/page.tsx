import TikoyCreator from '@/components/tikoy/TikoyCreator';

export default function CreateTikoyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-700 to-red-900">
      <nav className="flex justify-between items-center px-6 py-4 max-w-3xl mx-auto border-b border-red-600">
        <a href="/" className="text-yellow-300 font-bold text-xl">Tikoy Pass-Around</a>
      </nav>
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-white text-center mb-2">Create a Tikoy</h1>
        <p className="text-red-200 text-center mb-8 text-sm">
          Write a lucky message, get a shareable link. No sign-up needed.
        </p>
        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <TikoyCreator />
        </div>
      </main>
    </div>
  );
}
