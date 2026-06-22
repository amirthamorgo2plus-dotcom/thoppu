import Image from "next/image";
import Link from "next/link";
import { TreePine, Map, Users, Wheat, Droplets, AlertTriangle, Star, ArrowRight, TrendingUp, Shield, Smartphone } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="Thoppu" width={36} height={36} />
            <span className="font-bold text-green-900 text-lg">Thoppu</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <a href="#" className="hover:text-green-700">Home</a>
            <a href="#features" className="hover:text-green-700">Features</a>
            <a href="#marketplace" className="hover:text-green-700">Marketplace</a>
            <a href="#about" className="hover:text-green-700">About</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-600 hover:text-green-700 font-medium">Log In</Link>
            <Link href="/login" className="bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-800 transition-colors">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                Built for Tamil Nadu Plantation Farmers
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Your Farm,<br />
                <span className="text-green-700">In Your Palm.</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Manage your coconut farm remotely. Track workers, harvest, irrigation, and problems — all from your phone. Connect with climbers, traders, and suppliers on Tamil Nadu&apos;s first plantation marketplace.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/login" className="flex items-center justify-center gap-2 bg-green-700 text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-green-800 transition-colors text-sm">
                  Start Free — No Card Needed <ArrowRight size={16} />
                </Link>
                <a href="#features" className="flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-medium px-6 py-3.5 rounded-xl hover:bg-gray-50 transition-colors text-sm">
                  See How It Works
                </a>
              </div>
              <div className="flex items-center gap-6 mt-8 text-sm text-gray-500">
                <div className="flex items-center gap-1.5"><CheckCircle size={14} className="text-green-500" /> Free to start</div>
                <div className="flex items-center gap-1.5"><CheckCircle size={14} className="text-green-500" /> Tamil & English</div>
                <div className="flex items-center gap-1.5"><CheckCircle size={14} className="text-green-500" /> Works on any phone</div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="bg-green-900 px-4 py-3 flex items-center gap-2">
                  <Image src="/logo.png" alt="Thoppu" width={24} height={24} className="rounded" />
                  <span className="text-white text-sm font-medium">Thoppu Dashboard</span>
                </div>
                <div className="p-4 grid grid-cols-2 gap-3">
                  {[
                    { label: "Total Trees", value: "1,240", icon: "🌴", bg: "bg-green-50" },
                    { label: "Workers Today", value: "8", icon: "👷", bg: "bg-blue-50" },
                    { label: "Last Harvest", value: "420 nuts", icon: "🥥", bg: "bg-yellow-50" },
                    { label: "Open Problems", value: "1", icon: "⚠️", bg: "bg-red-50" },
                  ].map(({ label, value, icon, bg }) => (
                    <div key={label} className={`${bg} rounded-xl p-3`}>
                      <div className="text-xl mb-1">{icon}</div>
                      <div className="font-bold text-gray-800 text-lg">{value}</div>
                      <div className="text-xs text-gray-500">{label}</div>
                    </div>
                  ))}
                </div>
                <div className="px-4 pb-4">
                  <div className="bg-green-50 rounded-xl p-3">
                    <div className="text-xs text-gray-500 mb-2 font-medium">Today&apos;s Tasks</div>
                    {[
                      { worker: "Murugan", task: "Harvest Block A", status: "done" },
                      { worker: "Selvam", task: "Irrigation Block B", status: "in-progress" },
                      { worker: "Rajan", task: "Fertiliser Block C", status: "pending" },
                    ].map(({ worker, task, status }) => (
                      <div key={worker} className="flex items-center justify-between py-1.5">
                        <div>
                          <div className="text-xs font-medium text-gray-800">{worker}</div>
                          <div className="text-xs text-gray-400">{task}</div>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status === "done" ? "bg-green-100 text-green-700" : status === "in-progress" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-500"}`}>
                          {status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-green-700 text-white rounded-xl px-4 py-2 text-xs font-semibold shadow-lg">
                📍 Live from your farm
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-12 bg-green-900 text-white">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "100+", label: "Acres managed" },
            { value: "7", label: "Farm modules" },
            { value: "₹0", label: "Cost to start" },
            { value: "24/7", label: "Remote visibility" },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-3xl font-bold text-green-300">{value}</div>
              <div className="text-green-200 text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything your farm needs, in one app</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Stop managing your farm through phone calls and WhatsApp. Get full visibility from anywhere.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Map, title: "Farm Map", desc: "Pin every block, borewell, gate valve, and building with GPS. Tap any pin to see its live status.", color: "bg-green-100 text-green-700" },
              { icon: Users, title: "Workers & Tasks", desc: "Add workers, assign daily tasks, and track status in real time — pending, in-progress, done.", color: "bg-blue-100 text-blue-700" },
              { icon: Wheat, title: "Harvest Tracking", desc: "Log each harvest block by block with coconut count. See year-wise yield graphs automatically.", color: "bg-yellow-100 text-yellow-700" },
              { icon: Droplets, title: "Irrigation Control", desc: "Toggle gate valves open or closed remotely. Track which borewell feeds which block.", color: "bg-cyan-100 text-cyan-700" },
              { icon: AlertTriangle, title: "Problem Log", desc: "Report pest, disease, or equipment issues with type, block, and solution. Full history saved.", color: "bg-red-100 text-red-700" },
              { icon: TrendingUp, title: "Yield Analytics", desc: "Year-wise yield graphs, harvest averages, and block-wise performance at a glance.", color: "bg-purple-100 text-purple-700" },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                  <Icon size={20} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARKETPLACE ── */}
      <section id="marketplace" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              Coming Soon
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tamil Nadu&apos;s Coconut Farm Marketplace</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Everything your farm needs — in one place. Find climbers, sell your harvest, rent equipment, buy inputs, and fix your motor.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: "🧗", title: "Tree Climbers", desc: "Find experienced coconut tree climbers near your farm. Book by date and block.", tag: "₹800–1200/day" },
              { icon: "🥥", title: "Harvest Traders", desc: "Post your coconut lot and get bids from verified buyers across Tamil Nadu.", tag: "Live bidding" },
              { icon: "🚜", title: "Equipment Rental", desc: "Rent JCB, tractors, and sprayers by the day. GPS-tracked, insured.", tag: "JCB from ₹4,500/day" },
              { icon: "🌿", title: "Fertiliser & Inputs", desc: "Buy certified fertiliser, pesticide, and tools from verified local sellers.", tag: "Delivered to farm" },
              { icon: "🔧", title: "Motor & Repair", desc: "Find borewell motor repair services. Rate them after every job.", tag: "Rated & verified" },
              { icon: "👷", title: "Labour Contractors", desc: "Hire teams for land clearing, planting, and seasonal work by the day.", tag: "Team of 5–50" },
            ].map(({ icon, title, desc, tag }) => (
              <div key={title} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-gray-500 text-sm mb-3 leading-relaxed">{desc}</p>
                <span className="text-xs font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-full">{tag}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <p className="text-gray-500 text-sm mb-4">Want early access to the marketplace?</p>
            <Link href="/login" className="inline-flex items-center gap-2 bg-green-700 text-white font-semibold px-6 py-3 rounded-xl hover:bg-green-800 transition-colors text-sm">
              Join the Waitlist <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Up and running in 10 minutes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Create your account", desc: "Sign up free with your email. No card required. Works on any phone or computer." },
              { step: "02", title: "Set up your farm", desc: "Add your farm name, location, blocks, borewells, and workers in minutes." },
              { step: "03", title: "Manage from anywhere", desc: "See live status, assign tasks, log harvest — from Chennai, Coimbatore, anywhere." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 font-bold text-lg flex items-center justify-center mx-auto mb-4">{step}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why farmers trust Thoppu</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Your data is safe", desc: "Each farm owner sees only their own data. Bank-grade encryption. Hosted on Vercel + Supabase.", color: "text-blue-600", bg: "bg-blue-50" },
              { icon: Smartphone, title: "Works on any phone", desc: "No app download needed. Open in your browser on Android or iPhone — works instantly.", color: "text-green-600", bg: "bg-green-50" },
              { icon: Star, title: "Built from a real farm", desc: "Thoppu was built for a 100-acre coconut farm in Tamil Nadu. Every feature solves a real problem.", color: "text-yellow-600", bg: "bg-yellow-50" },
            ].map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="text-center p-6">
                <div className={`w-12 h-12 rounded-full ${bg} flex items-center justify-center mx-auto mb-4`}>
                  <Icon size={22} className={color} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="py-20 px-6 bg-green-50">
        <div className="max-w-3xl mx-auto text-center">
          <Image src="/logo.png" alt="Thoppu" width={64} height={64} className="mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Built in Tamil Nadu, for Tamil Nadu</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Thoppu (தோப்பு) means farm or grove in Tamil. We built this because a coconut farm owner in our family had no way to monitor her 100-acre farm remotely. Phone calls to the farm manager, guessing yield numbers, finding out about pest damage weeks late — that is the reality for thousands of plantation owners in Tamil Nadu.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Thoppu changes that. We are starting small, building right, and growing with every farmer who trusts us with their land.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 bg-green-900 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Your farm deserves better than WhatsApp.</h2>
          <p className="text-green-200 mb-8">Start free today. No credit card. No setup fee. Just your farm, in your palm.</p>
          <Link href="/login" className="inline-flex items-center gap-2 bg-white text-green-900 font-bold px-8 py-4 rounded-xl hover:bg-green-50 transition-colors">
            Get Started Free <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-10 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Thoppu" width={28} height={28} />
            <span className="font-bold text-green-900">Thoppu</span>
            <span className="text-gray-400 text-sm">— Your Farm, In Your Palm</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/login" className="hover:text-green-700">Login</Link>
            <a href="#features" className="hover:text-green-700">Features</a>
            <a href="#pricing" className="hover:text-green-700">Pricing</a>
            <span>© 2026 Thoppu</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
