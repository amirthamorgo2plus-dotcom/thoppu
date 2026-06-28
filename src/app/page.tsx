import Image from "next/image";
import Link from "next/link";
import {
  TreePine, Map, Users, Wheat, Droplets, AlertTriangle, Star, ArrowRight,
  TrendingUp, Shield, Smartphone, CheckCircle, CloudSun, IndianRupee,
  MapPin, Zap, BarChart3, Satellite,
} from "lucide-react";
import CatchCoconuts from "@/components/CatchCoconuts";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="Thoppu" width={36} height={36} />
            <span className="font-bold text-green-900 text-lg">Thoppu <span className="font-medium text-green-600">தோப்பு</span></span>
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
                Manage your coconut farm remotely. Satellite maps, live weather alerts, finance tracking, geofencing — all in one app built for Tamil Nadu plantation owners.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/login" className="flex items-center justify-center gap-2 bg-green-700 text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-green-800 transition-colors text-sm">
                  Start Free — No Card Needed <ArrowRight size={16} />
                </Link>
                <Link href="/app/00000000-0000-0000-0000-000000000001/dashboard" className="flex items-center justify-center gap-2 border border-green-300 text-green-700 font-medium px-6 py-3.5 rounded-xl hover:bg-green-50 transition-colors text-sm">
                  🌴 Visit Our Demo Farm
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-8 text-sm text-gray-500 flex-wrap">
                <div className="flex items-center gap-1.5"><CheckCircle size={14} className="text-green-500" /> Free to start</div>
                <div className="flex items-center gap-1.5"><CheckCircle size={14} className="text-green-500" /> Tamil & English</div>
                <div className="flex items-center gap-1.5"><CheckCircle size={14} className="text-green-500" /> Works on any phone</div>
              </div>
            </div>

            {/* Hero mockup */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="bg-green-900 px-4 py-3 flex items-center gap-2">
                  <Image src="/logo.png" alt="Thoppu" width={24} height={24} className="rounded" />
                  <span className="text-white text-sm font-medium">Kallapuram Farm — Dashboard</span>
                </div>
                {/* Weather strip */}
                <div className="bg-green-800 px-4 py-3 flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">⛅</span>
                    <div>
                      <div className="font-bold text-xl">32°C <span className="text-green-300 text-sm font-normal">Partly Cloudy</span></div>
                      <div className="text-green-400 text-xs">💧 74% humidity · No rain expected</div>
                    </div>
                  </div>
                  <div className="hidden sm:flex gap-3 text-center text-xs">
                    {[["☀️","33°","Mon"],["🌧️","29°","Tue"],["⛅","31°","Wed"]].map(([e,t,d]) => (
                      <div key={d}><div className="text-green-400 text-[10px]">{d}</div><div className="text-lg">{e}</div><div className="font-medium">{t}</div></div>
                    ))}
                  </div>
                </div>
                <div className="p-4 grid grid-cols-2 gap-3">
                  {[
                    { label: "This Month Harvest", value: "4,410 nuts", icon: "🥥", bg: "bg-green-50", val: "text-green-700" },
                    { label: "Workers Today", value: "5 active", icon: "👷", bg: "bg-blue-50", val: "text-blue-700" },
                    { label: "Net Profit (Jun)", value: "₹43,200", icon: "📈", bg: "bg-emerald-50", val: "text-emerald-700" },
                    { label: "Open Problems", value: "1 issue", icon: "⚠️", bg: "bg-orange-50", val: "text-orange-600" },
                  ].map(({ label, value, icon, bg, val }) => (
                    <div key={label} className={`${bg} rounded-xl p-3`}>
                      <div className="text-xl mb-1">{icon}</div>
                      <div className={`font-bold text-base ${val}`}>{value}</div>
                      <div className="text-xs text-gray-500">{label}</div>
                    </div>
                  ))}
                </div>
                {/* Mini chart */}
                <div className="px-4 pb-4">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="text-xs font-medium text-gray-500 mb-2">Monthly Harvest — 2026</div>
                    <div className="flex items-end gap-1.5 h-14">
                      {[
                        ["Jan","#86efac",55],["Feb","#6ee7b7",62],["Mar","#34d399",78],
                        ["Apr","#10b981",72],["May","#059669",82],["Jun","#047857",100],
                      ].map(([m, c, h]) => (
                        <div key={m as string} className="flex-1 flex flex-col items-center gap-0.5">
                          <div className="w-full rounded-t-sm" style={{ height: `${h}%`, background: c as string }} />
                          <span className="text-[9px] text-gray-400">{m as string}</span>
                        </div>
                      ))}
                    </div>
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
            { value: "9", label: "Farm modules" },
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

      {/* ── SPOTLIGHT: GEOFENCE + SATELLITE MAP ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
                <Satellite size={12} /> Satellite Map
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">See your farm from space. Draw geofences around every block.</h2>
              <p className="text-gray-500 leading-relaxed mb-6">
                Switch between satellite and street view instantly. Click on the map to draw geofence polygons around your blocks, borewells, and buildings. Every pin you place is saved with GPS coordinates.
              </p>
              <ul className="space-y-3 text-sm text-gray-600">
                {[
                  "Live Esri satellite imagery — no API key needed",
                  "Draw polygons for Block A, B, C with custom colors",
                  "Pin borewells, gates, stores with labels",
                  "Undo points, rename and delete geofences",
                  "Street map overlay shows road names and landmarks",
                ].map(f => (
                  <li key={f} className="flex items-start gap-2.5">
                    <CheckCircle size={15} className="text-green-500 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            {/* Map mockup */}
            <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-xl border border-gray-800 relative">
              <div className="bg-gray-800 px-4 py-2.5 flex items-center justify-between">
                <span className="text-white text-sm font-medium flex items-center gap-2"><Map size={14} className="text-green-400" /> Farm Map — Kallapuram</span>
                <div className="flex gap-2">
                  <span className="bg-green-700 text-white text-xs px-2 py-0.5 rounded-full">🛰 Satellite</span>
                  <span className="bg-gray-600 text-gray-300 text-xs px-2 py-0.5 rounded-full">🗺 Street</span>
                </div>
              </div>
              {/* Fake satellite grid */}
              <div className="relative h-56 bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 overflow-hidden">
                <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 opacity-20">
                  {Array.from({length: 48}).map((_, i) => <div key={i} className="border border-green-600" />)}
                </div>
                {/* Geofence polygon */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 224">
                  <polygon points="60,30 340,30 340,190 60,190" fill="rgba(34,197,94,0.15)" stroke="#22c55e" strokeWidth="2" strokeDasharray="6,3" />
                  <polygon points="80,50 200,50 200,140 80,140" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth="1.5" />
                  <text x="115" y="100" fill="#93c5fd" fontSize="11" textAnchor="middle">Block A</text>
                  <polygon points="210,55 330,55 330,145 210,145" fill="rgba(168,85,247,0.15)" stroke="#a855f7" strokeWidth="1.5" />
                  <text x="270" y="105" fill="#c4b5fd" fontSize="11" textAnchor="middle">Block B</text>
                  <text x="197" y="22" fill="#86efac" fontSize="10" textAnchor="middle">Farm Boundary</text>
                </svg>
                {/* Pins */}
                {[
                  { x: 110, y: 65, color: "#3b82f6", label: "Valve 1" },
                  { x: 260, y: 70, color: "#f59e0b", label: "Borewell" },
                  { x: 60, y: 180, color: "#ef4444", label: "Gate" },
                ].map(({ x, y, color, label }) => (
                  <div key={label} className="absolute flex flex-col items-center" style={{ left: `${(x/400)*100}%`, top: `${(y/224)*100}%` }}>
                    <div className="w-4 h-4 rounded-full border-2 border-white shadow-lg" style={{ background: color }} />
                    <span className="text-white text-[8px] font-medium mt-0.5 bg-black/40 px-1 rounded">{label}</span>
                  </div>
                ))}
              </div>
              <div className="bg-gray-800 px-4 py-2.5 text-xs text-gray-400 flex justify-between">
                <span>🟢 Farm Boundary &nbsp; 🔵 Block A &nbsp; 🟣 Block B</span>
                <span className="text-green-400">3 pins saved</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SPOTLIGHT: WEATHER ── */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Weather mockup */}
            <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
              <div className="bg-blue-900 px-5 py-4 text-white flex items-center gap-3">
                <CloudSun size={20} className="text-blue-300" />
                <span className="font-semibold">Weather & Farm Alerts</span>
                <span className="ml-auto text-blue-400 text-xs">📍 Pollachi, TN</span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-4 mb-5">
                  <span className="text-6xl">⛅</span>
                  <div>
                    <div className="text-4xl font-bold text-gray-800">32°C</div>
                    <div className="text-gray-500 text-sm">Partly Cloudy · Tue, 24 Jun</div>
                    <div className="text-xs text-blue-600 mt-1">💧 74% humidity &nbsp;💨 12 km/h wind</div>
                  </div>
                </div>
                {/* Farm alerts */}
                <div className="space-y-2 mb-4">
                  <div className="bg-orange-50 text-orange-800 rounded-lg px-3 py-2 text-xs flex items-start gap-2">
                    <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                    🏜️ Dry spell ahead — schedule irrigation for Block A &amp; B
                  </div>
                  <div className="bg-green-50 text-green-800 rounded-lg px-3 py-2 text-xs flex items-start gap-2">
                    <CheckCircle size={12} className="mt-0.5 shrink-0" />
                    ✅ Good conditions for harvesting this week
                  </div>
                  <div className="bg-blue-50 text-blue-800 rounded-lg px-3 py-2 text-xs flex items-start gap-2">
                    <span className="shrink-0">🌕</span>
                    Moon: Waxing Gibbous — good for planting
                  </div>
                </div>
                {/* 5-day */}
                <div className="grid grid-cols-5 gap-1">
                  {[["Mon","☀️","33°"],["Tue","🌧️","29°"],["Wed","⛅","31°"],["Thu","☀️","34°"],["Fri","🌦️","30°"]].map(([d,e,t]) => (
                    <div key={d as string} className="text-center bg-gray-50 rounded-lg py-2">
                      <div className="text-[10px] text-gray-400">{d as string}</div>
                      <div className="text-lg my-0.5">{e as string}</div>
                      <div className="text-xs font-semibold text-gray-700">{t as string}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
                <CloudSun size={12} /> Live Weather
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Farm-specific weather alerts. Know before problems hit.</h2>
              <p className="text-gray-500 leading-relaxed mb-6">
                Thoppu pulls live weather from Open-Meteo for your exact farm coordinates. It doesn&apos;t just show rain — it tells you what to do: delay spraying, start irrigation, watch for fungal disease.
              </p>
              <ul className="space-y-3 text-sm text-gray-600">
                {[
                  "Current temp, humidity, wind, and rain — live",
                  "7-day forecast with daily min/max",
                  "Actionable farm alerts based on forecast",
                  "Moon phase for planting guidance",
                  "Dashboard strip with 5-day mini forecast",
                ].map(f => (
                  <li key={f} className="flex items-start gap-2.5">
                    <CheckCircle size={15} className="text-cyan-500 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── SPOTLIGHT: FINANCE ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
                <IndianRupee size={12} /> Farm Finance
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Know your farm&apos;s profit to the rupee. Every month.</h2>
              <p className="text-gray-500 leading-relaxed mb-6">
                Log income from coconut and copra sales. Track every expense — fertiliser, labour, EB bill, land tax, repairs. See exactly where your money goes with colorful category charts.
              </p>
              <ul className="space-y-3 text-sm text-gray-600">
                {[
                  "Income vs expense chart — last 6 months",
                  "Category breakdown: EB bill, fertiliser, labour, land tax",
                  "Filter by month and year",
                  "Net profit/loss calculated automatically",
                  "Full ledger with date-wise transaction history",
                ].map(f => (
                  <li key={f} className="flex items-start gap-2.5">
                    <CheckCircle size={15} className="text-emerald-500 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            {/* Finance mockup */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-green-700 px-5 py-4 text-white flex items-center gap-3">
                <IndianRupee size={18} className="text-green-300" />
                <span className="font-semibold">Finance — June 2026</span>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="bg-green-700 text-white rounded-xl p-3 text-center">
                    <div className="text-lg font-bold">₹81,000</div>
                    <div className="text-green-300 text-[10px]">Income</div>
                  </div>
                  <div className="bg-red-500 text-white rounded-xl p-3 text-center">
                    <div className="text-lg font-bold">₹37,800</div>
                    <div className="text-red-200 text-[10px]">Expenses</div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                    <div className="text-lg font-bold text-green-700">₹43,200</div>
                    <div className="text-gray-500 text-[10px]">Net Profit</div>
                  </div>
                </div>
                {/* Income vs expense bars */}
                <div className="mb-4">
                  <div className="text-xs font-medium text-gray-500 mb-2">Last 6 months</div>
                  <div className="flex items-end gap-2 h-16">
                    {[
                      ["Jan",56,37],["Feb",61,38],["Mar",86,43],
                      ["Apr",66,40],["May",72,42],["Jun",81,38],
                    ].map(([m, inc, exp]) => {
                      const maxV = 90;
                      return (
                        <div key={m as string} className="flex-1 flex flex-col items-center gap-0.5">
                          <div className="w-full flex gap-0.5 items-end" style={{ height: "52px" }}>
                            <div className="flex-1 rounded-t-sm bg-green-300" style={{ height: `${((inc as number)/maxV)*52}px` }} />
                            <div className="flex-1 rounded-t-sm bg-red-300" style={{ height: `${((exp as number)/maxV)*52}px` }} />
                          </div>
                          <span className="text-[9px] text-gray-400">{m as string}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Expense breakdown */}
                <div className="space-y-1.5">
                  {[
                    ["👷 Labour",       "₹18,500", 49, "#bfdbfe"],
                    ["⚡ Electricity",  "₹4,100",  11, "#fde68a"],
                    ["🔨 Repair",       "₹3,200",   8, "#fca5a5"],
                    ["🌿 Fertiliser",   "₹6,800",  18, "#bbf7d0"],
                    ["🐛 Pesticide",    "₹2,900",   8, "#f9a8d4"],
                  ].map(([label, val, pct, color]) => (
                    <div key={label as string}>
                      <div className="flex justify-between text-[10px] text-gray-500 mb-0.5">
                        <span>{label as string}</span><span className="font-medium">{val as string}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct as number}%`, background: color as string }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section id="features" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything your farm needs, in one app</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Stop managing your farm through phone calls and WhatsApp. Get full visibility from anywhere.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Satellite,     title: "Satellite Farm Map",     desc: "Live Esri satellite view of your farm. Draw geofence polygons, pin blocks, borewells, gates — all with GPS coordinates.", color: "bg-blue-100 text-blue-700" },
              { icon: CloudSun,      title: "Weather & Farm Alerts",  desc: "Real-time weather for your farm's GPS location. Actionable alerts: delay spray, start irrigation, watch for disease.", color: "bg-cyan-100 text-cyan-700" },
              { icon: IndianRupee,   title: "Finance & EB Bill",      desc: "Track every rupee — coconut income, fertiliser, EB bill, land tax, labour. Month-wise profit/loss with colorful charts.", color: "bg-emerald-100 text-emerald-700" },
              { icon: Users,         title: "Workers & Tasks",        desc: "Add workers, assign daily tasks, and track status — pending, in-progress, done. 6-month task completion chart.", color: "bg-purple-100 text-purple-700" },
              { icon: Wheat,         title: "Harvest Tracking",       desc: "Log harvests block by block. Monthly bar chart, block-wise breakdown, average per session — all filtered by year/month.", color: "bg-yellow-100 text-yellow-700" },
              { icon: Droplets,      title: "Irrigation Control",     desc: "Toggle gate valves open/closed. Track borewells by depth, motor HP, which block they feed, and last service date.", color: "bg-blue-100 text-blue-700" },
              { icon: AlertTriangle, title: "Problem Log",            desc: "Report pest, disease, equipment issues by type and block. Status: open → in-progress → resolved. Full history.", color: "bg-red-100 text-red-700" },
              { icon: BarChart3,     title: "Charts Everywhere",      desc: "Every module has colorful charts — monthly harvest bars, income vs expense, task completion, problem trends.", color: "bg-pink-100 text-pink-700" },
              { icon: MapPin,        title: "GPS Location Pins",      desc: "Drop pins on the satellite map with custom labels — borewell, block entry, gate, store. Saved to your farm forever.", color: "bg-orange-100 text-orange-700" },
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

          <div className="text-center mt-10">
            <Link href="/app/00000000-0000-0000-0000-000000000001/dashboard"
              className="inline-flex items-center gap-2 bg-green-700 text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-green-800 transition-colors text-sm">
              🌴 Visit Our Demo Farm <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── MARKETPLACE ── */}
      <section id="marketplace" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              Coming Soon
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tamil Nadu&apos;s Coconut Farm Marketplace</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Find climbers, sell harvest, rent equipment, buy inputs — all in one place for plantation owners across Tamil Nadu.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: "🧗", title: "Tree Climbers",       desc: "Find experienced coconut tree climbers near your farm. Book by date and block.",                 tag: "₹800–1200/day" },
              { icon: "🥥", title: "Harvest Traders",     desc: "Post your coconut lot and get bids from verified buyers across Tamil Nadu.",                     tag: "Live bidding" },
              { icon: "🚜", title: "Equipment Rental",    desc: "Rent JCB, tractors, and sprayers by the day. GPS-tracked, insured.",                            tag: "JCB from ₹4,500/day" },
              { icon: "🌿", title: "Fertiliser & Inputs", desc: "Buy certified fertiliser, pesticide, and tools from verified local sellers.",                    tag: "Delivered to farm" },
              { icon: "🔧", title: "Motor & Repair",      desc: "Find borewell motor repair services near you. Rate them after every job.",                       tag: "Rated & verified" },
              { icon: "👷", title: "Labour Contractors",  desc: "Hire teams for land clearing, planting, and seasonal work by the day.",                          tag: "Team of 5–50" },
            ].map(({ icon, title, desc, tag }) => (
              <div key={title} className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
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

      {/* ── ECOSYSTEM / EXPERIENCES (COMING SOON) ── */}
      <section id="experiences" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              Coming Soon
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">More than management — a whole farm ecosystem</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">A farm can earn in every direction. Thoppu is opening farms to families, schools, students and experts — all from the same app.</p>
          </div>
          {/* Featured: Farm Resort */}
          <div className="bg-gradient-to-br from-green-900 to-emerald-800 rounded-3xl p-8 md:p-10 mb-6 text-white relative overflow-hidden">
            <span className="absolute top-5 right-5 text-[10px] font-semibold text-amber-200 bg-white/15 px-2.5 py-1 rounded-full">Coming Soon</span>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="text-4xl mb-3">🏕️🧘</div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3">Thoppu Farm Resort — your calm escape</h3>
                <p className="text-green-100 leading-relaxed mb-5">
                  A quiet, screen-free retreat in a real coconut farm. Capsule stays, a compact pool, farm-to-table meals, meditation &amp; yoga decks, and easy games — built for Gen-Z and young travellers who just want to unplug from the rush and breathe.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["🧘 Meditation & yoga deck", "🛏️ Capsule stays", "💧 Compact pool", "🍃 Digital detox", "🍽️ Farm-to-table", "🏸 Games & nature trails"].map(t => (
                    <span key={t} className="text-xs bg-white/10 border border-white/15 rounded-full px-3 py-1">{t}</span>
                  ))}
                </div>
              </div>
              <div className="bg-white/10 rounded-2xl p-6 border border-white/15">
                <p className="text-green-200 text-sm font-medium mb-3">Who it&apos;s for</p>
                <ul className="space-y-2 text-sm text-green-50">
                  <li>🌏 Foreign youngsters & backpackers seeking authentic rural India</li>
                  <li>💻 Burnt-out professionals & digital nomads wanting a reset</li>
                  <li>🧘 Wellness / meditation & yoga retreat groups</li>
                  <li>👫 Couples & friend-groups for a weekend unplug</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: "🌳", title: "Farm Day-Out", desc: "Weekend farm experiences for families — grove walks, fruit plucking, bullock-cart rides, banana-leaf Tamil lunch. Kid & elder friendly.", who: "For families & corporates" },
              { icon: "🎒", title: "School Trips", desc: "Curriculum-linked, safe educational field trips — seed-to-harvest, composting, water management. Consent slips & certificates built in.", who: "For schools & colleges" },
              { icon: "🎓", title: "Agri Internships", desc: "Hands-on internships connecting agri students and aspiring farmers with real host farms. Attendance, stipend & certificates.", who: "For students & host farms" },
              { icon: "🧑‍🌾", title: "Agri Consultancy", desc: "On-demand expert advice + AI advisory in Tamil — crop planning, pest control, organic certification, govt schemes.", who: "For farmers & FPOs" },
            ].map(({ icon, title, desc, who }) => (
              <div key={title} className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-6 relative">
                <span className="absolute top-4 right-4 text-[10px] font-semibold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">Soon</span>
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-gray-500 text-sm mb-3 leading-relaxed">{desc}</p>
                <span className="text-xs font-medium text-green-700">{who}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <p className="text-gray-500 text-sm mb-4">Want to host visitors, trips or interns on your farm?</p>
            <Link href="/login" className="inline-flex items-center gap-2 bg-green-700 text-white font-semibold px-6 py-3 rounded-xl hover:bg-green-800 transition-colors text-sm">
              Join the Waitlist <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── MINI GAME ── */}
      <section id="game" className="py-20 px-6 bg-gradient-to-b from-white to-green-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              🎮 Just for fun
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Play Thoppu Catch 🥥</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Bring the kids along — catch falling coconuts and beat your best score. A little taste of farm life.</p>
          </div>
          <CatchCoconuts />
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-6 bg-green-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Up and running in 10 minutes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Create your account", desc: "Sign up free with your email. Magic link — no password needed. Works on any phone." },
              { step: "02", title: "Set up your farm", desc: "Add your farm, drop GPS pins on the satellite map, add workers and blocks in minutes." },
              { step: "03", title: "Manage from anywhere", desc: "See live weather, assign tasks, log harvest, track finance — from anywhere in the world." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-green-700 text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">{step}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why farmers trust Thoppu</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Shield,     title: "Your data is safe",        desc: "Each farm owner sees only their own data. Bank-grade encryption. Hosted on Vercel + Supabase.", color: "text-blue-600", bg: "bg-blue-50" },
              { icon: Smartphone, title: "Works on any phone",       desc: "No app download needed. Open in your browser on Android or iPhone — works instantly.", color: "text-green-600", bg: "bg-green-50" },
              { icon: Star,       title: "Built from a real farm",   desc: "Thoppu was built for a 100-acre coconut farm in Tamil Nadu. Every feature solves a real problem.", color: "text-yellow-600", bg: "bg-yellow-50" },
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
            Thoppu changes that. Satellite maps, live weather, finance tracking, geofencing — built by farmers, for farmers.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 bg-green-900 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Your farm deserves better than WhatsApp.</h2>
          <p className="text-green-200 mb-8">Start free today. No credit card. No setup fee. Just your farm, in your palm.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="inline-flex items-center justify-center gap-2 bg-white text-green-900 font-bold px-8 py-4 rounded-xl hover:bg-green-50 transition-colors">
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link href="/app/00000000-0000-0000-0000-000000000001/dashboard"
              className="inline-flex items-center justify-center gap-2 border border-green-600 text-green-200 font-semibold px-8 py-4 rounded-xl hover:bg-green-800 transition-colors">
              🌴 Visit Our Demo Farm
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-10 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Thoppu" width={28} height={28} />
            <span className="font-bold text-green-900">Thoppu <span className="font-medium text-green-600">தோப்பு</span></span>
            <span className="text-gray-400 text-sm">— Your Farm, In Your Palm</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/login" className="hover:text-green-700">Login</Link>
            <a href="#features" className="hover:text-green-700">Features</a>
            <a href="#marketplace" className="hover:text-green-700">Marketplace</a>
            <span>© 2026 Thoppu</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
