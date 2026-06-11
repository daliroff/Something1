import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fef9ef 0%, #fef3c7 100%)' }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📖</span>
          <span className="text-xl font-bold text-amber-800">DayDiary</span>
        </div>
        <div className="flex gap-3">
          <Link href="/login" className="btn-secondary text-sm">
            Sign In
          </Link>
          <Link href="/register" className="btn-primary text-sm">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="text-6xl mb-6">✍️</div>
        <h1 className="text-5xl font-bold text-stone-800 mb-4 leading-tight">
          Your daily diary,<br />
          <span className="text-amber-600">written or spoken</span>
        </h1>
        <p className="text-lg text-stone-600 mb-10 max-w-xl mx-auto">
          Capture your thoughts, feelings, and memories every day.
          Type your entries or just speak — DayDiary listens and remembers for you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="btn-primary text-base px-8 py-3">
            Start Your Diary — Free
          </Link>
          <Link href="/login" className="btn-secondary text-base px-8 py-3">
            I already have an account
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center text-stone-800 mb-12">
          Everything you need to journal daily
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: '✍️',
              title: 'Write your thoughts',
              desc: 'Type freely in a distraction-free editor. Express yourself with all the nuance words allow.',
            },
            {
              icon: '🎙️',
              title: 'Speak your mind',
              desc: 'Too tired to type? Just speak. Your voice is transcribed in real time into your diary.',
            },
            {
              icon: '🔒',
              title: 'Private & personal',
              desc: 'Your entries are yours alone. Protected by your account — nobody else can read them.',
            },
            {
              icon: '😊',
              title: 'Track your mood',
              desc: 'Tag each entry with how you\'re feeling and discover patterns over time.',
            },
            {
              icon: '📅',
              title: 'Daily timeline',
              desc: 'Browse your entries by day, week, or month and relive your journey.',
            },
            {
              icon: '✏️',
              title: 'Edit anytime',
              desc: 'Memory is imperfect. Update or refine past entries whenever you like.',
            },
          ].map((f) => (
            <div key={f.title} className="card hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-stone-800 mb-2">{f.title}</h3>
              <p className="text-stone-600 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-xl mx-auto px-6 py-16 text-center">
        <div className="bg-amber-500 rounded-2xl p-10 text-white">
          <div className="text-4xl mb-4">🌟</div>
          <h2 className="text-2xl font-bold mb-3">Start journaling today</h2>
          <p className="mb-6 opacity-90">It only takes 30 seconds to create your account and write your first entry.</p>
          <Link href="/register" className="inline-block bg-white text-amber-700 font-semibold px-8 py-3 rounded-lg hover:bg-amber-50 transition-colors">
            Create your free diary
          </Link>
        </div>
      </section>

      <footer className="text-center py-8 text-stone-400 text-sm">
        © {new Date().getFullYear()} DayDiary — Your thoughts, your story.
      </footer>
    </div>
  )
}
