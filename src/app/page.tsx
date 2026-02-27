import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-red-700 to-red-900 text-white">

      {/* Nav */}
      <nav className="flex justify-between items-center px-6 py-4 max-w-5xl mx-auto">
        <span className="text-2xl font-bold text-yellow-300">Tikoy Pass-Around</span>
        <Link
          href="/create-tikoy"
          className="px-4 py-2 bg-yellow-300 text-red-900 rounded-lg hover:bg-yellow-200 transition-colors font-medium"
        >
          Send a Tikoy
        </Link>
      </nav>

      {/* Hero */}
      <section className="text-center py-20 px-6 max-w-3xl mx-auto">
        <div className="text-7xl mb-6">🧧</div>
        <h1 className="text-5xl font-bold mb-4 leading-tight">
          Send Luck This{' '}
          <span className="text-yellow-300">Chinese New Year</span>
        </h1>
        <p className="text-xl text-red-200 mb-8 leading-relaxed">
          Gift a virtual Tikoy with a personalized lucky message.
          Your friend gets a special link — they must pass it forward within 24 hours
          to keep the luck alive!
        </p>
        <Link
          href="/create-tikoy"
          className="inline-block px-8 py-4 bg-yellow-300 text-red-900 rounded-full text-lg font-bold hover:bg-yellow-200 transition-colors shadow-lg"
        >
          Create a Tikoy — No sign up needed
        </Link>
        <p className="mt-4 text-red-300 text-sm italic">
          Celebrate the spirit of Binondo — one Tikoy at a time
        </p>
      </section>

      {/* How it works */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-yellow-300 mb-12">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: '1',
              emoji: '✍️',
              title: 'Write a Tikoy',
              desc: 'Enter your name and write a lucky message. No account needed.',
            },
            {
              step: '2',
              emoji: '🔗',
              title: 'Share the Link',
              desc: 'You get a unique link. Send it to a friend — they have 24 hours to pass it on!',
            },
            {
              step: '3',
              emoji: '🗺️',
              title: 'Watch It Travel',
              desc: 'See how many people your Tikoy passes through as the luck spreads.',
            },
          ].map(({ step, emoji, title, desc }) => (
            <div key={step} className="text-center bg-red-800 bg-opacity-50 rounded-2xl p-6 border border-red-600">
              <div className="text-4xl mb-3">{emoji}</div>
              <div className="w-8 h-8 bg-yellow-300 text-red-900 rounded-full flex items-center justify-center font-bold text-sm mx-auto mb-3">
                {step}
              </div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-red-200 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cultural note */}
      <section className="py-12 px-6 max-w-2xl mx-auto text-center border-t border-red-600">
        <p className="text-red-200 leading-relaxed">
          Rooted in the beloved tradition of gifting Tikoy (nian gao) during Chinese New Year,
          this app celebrates Filipino-Chinese heritage — the warmth of Binondo, the spirit of
          togetherness, and the joy of sharing luck with others.
        </p>
        <p className="mt-4 text-yellow-300 font-semibold text-lg">
          Gong Xi Fa Cai! Huat Ah!
        </p>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-red-400 text-sm border-t border-red-700">
        Tikoy Pass-Around &copy; {new Date().getFullYear()} · Made with love for the Filipino-Chinese community
      </footer>
    </main>
  );
}
