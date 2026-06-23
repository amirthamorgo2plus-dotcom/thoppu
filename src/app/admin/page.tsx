"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Users, Wheat, MessageCircle, LogOut, Send, TrendingUp } from "lucide-react";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "";

type Farm = { id: string; name: string; location: string; owner_email: string; created_at: string };

export default function AdminPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [email, setEmail] = useState("");
  const [linkStatus, setLinkStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user || data.user.email !== ADMIN_EMAIL) { router.push("/login"); return; }
      setAuthorized(true);
      fetch("/api/admin/farms").then(r => r.json()).then(d => {
        setFarms(d.farms || []);
        setTotalUsers(d.totalUsers || 0);
      });
    });
  }, [router]);

  const sendWhatsApp = async () => {
    if (!email) return;
    setLoading(true); setLinkStatus("");
    const res = await fetch("/api/admin/generate-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (data.link) {
      const msg = encodeURIComponent(`Welcome to Thoppu! 🌴\n\nClick this link to sign in to your farm dashboard:\n${data.link}\n\nThis link expires in 1 hour.`);
      window.open(`https://wa.me/?text=${msg}`, "_blank");
      setLinkStatus(`Magic link generated for ${email}`);
    } else {
      setLinkStatus(`Error: ${data.error}`);
    }
    setLoading(false);
  };

  const signOut = async () => { await supabase.auth.signOut(); router.push("/login"); };

  if (!authorized) return <div className="min-h-screen flex items-center justify-center text-gray-400">Checking access...</div>;

  const thisMonth = farms.filter(f => new Date(f.created_at) > new Date(Date.now() - 30 * 864e5)).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-900 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Thoppu Admin</h1>
          <p className="text-green-300 text-xs mt-0.5">Logged in as Admin</p>
        </div>
        <button onClick={signOut} className="flex items-center gap-2 text-green-300 hover:text-white text-sm">
          <LogOut size={16} /> Sign out
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Farms", value: farms.length, icon: Wheat, color: "text-green-600" },
            { label: "Total Users", value: totalUsers, icon: Users, color: "text-blue-600" },
            { label: "New This Month", value: thisMonth, icon: TrendingUp, color: "text-orange-500" },
            { label: "Active Today", value: "—", icon: TrendingUp, color: "text-purple-600" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <Icon className={`${color} mb-2`} size={20} />
              <div className={`text-3xl font-bold ${color}`}>{value}</div>
              <div className="text-sm text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
          <h2 className="font-semibold text-gray-700 mb-4">Farm Signups — Last 6 Months</h2>
          <div className="flex items-end gap-3 h-32">
            {Array.from({ length: 6 }, (_, i) => {
              const d = new Date(); d.setMonth(d.getMonth() - (5 - i));
              const label = d.toLocaleString("default", { month: "short" });
              const count = farms.filter(f => {
                const fd = new Date(f.created_at);
                return fd.getMonth() === d.getMonth() && fd.getFullYear() === d.getFullYear();
              }).length;
              const max = Math.max(...Array.from({ length: 6 }, (_, j) => {
                const d2 = new Date(); d2.setMonth(d2.getMonth() - (5 - j));
                return farms.filter(f => {
                  const fd = new Date(f.created_at);
                  return fd.getMonth() === d2.getMonth() && fd.getFullYear() === d2.getFullYear();
                }).length;
              }), 1);
              const height = Math.max((count / max) * 100, 4);
              return (
                <div key={label} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-medium text-gray-600">{count}</span>
                  <div className="w-full bg-green-600 rounded-t-md transition-all" style={{ height: `${height}%` }} />
                  <span className="text-xs text-gray-400">{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="text-green-600" size={20} />
            <h2 className="font-semibold text-gray-700">Send Magic Link via WhatsApp</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">Enter the user&apos;s email to generate a sign-in link and send it via WhatsApp.</p>
          <div className="flex gap-3">
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendWhatsApp()}
              placeholder="user@email.com"
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button onClick={sendWhatsApp} disabled={loading || !email}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50">
              <Send size={15} /> {loading ? "Generating..." : "Send via WhatsApp"}
            </button>
          </div>
          {linkStatus && <p className="text-sm mt-3 text-green-700">{linkStatus}</p>}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-700">All Farms ({farms.length})</h2>
          </div>
          {farms.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No farms yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-3 text-left">Farm Name</th>
                    <th className="px-6 py-3 text-left">Owner Email</th>
                    <th className="px-6 py-3 text-left">Location</th>
                    <th className="px-6 py-3 text-left">Created</th>
                    <th className="px-6 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {farms.map(f => (
                    <tr key={f.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-800">{f.name}</td>
                      <td className="px-6 py-4 text-gray-500">{f.owner_email}</td>
                      <td className="px-6 py-4 text-gray-500">{f.location || "—"}</td>
                      <td className="px-6 py-4 text-gray-400">{new Date(f.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <button onClick={() => setEmail(f.owner_email)} className="text-xs text-green-700 hover:underline">
                          Send link
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
