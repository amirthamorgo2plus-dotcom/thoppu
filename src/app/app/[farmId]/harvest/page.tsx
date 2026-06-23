"use client";
import { use, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Wheat, Trash2 } from "lucide-react";

type Log = { id: string; date: string; block: string; count: number; notes: string };

function BarChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-2 h-28">
      {data.map(({ label, value, color }) => (
        <div key={label} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-xs text-gray-500">{value > 0 ? value.toLocaleString() : ""}</span>
          <div className="w-full rounded-t-md transition-all" style={{ height: `${Math.max((value / max) * 100, 2)}%`, background: color }} />
          <span className="text-xs text-gray-400 truncate w-full text-center">{label}</span>
        </div>
      ))}
    </div>
  );
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const COLORS = ["#86efac","#6ee7b7","#67e8f9","#a5f3fc","#bfdbfe","#c4b5fd","#f9a8d4","#fca5a5","#fcd34d","#86efac","#6ee7b7","#67e8f9"];

export default function Harvest({ params }: { params: Promise<{ farmId: string }> }) {
  const { farmId } = use(params);
  const [logs, setLogs] = useState<Log[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: "", block: "", count: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());
  const [filterMonth, setFilterMonth] = useState("all");

  const fetchAll = async () => {
    const { data } = await supabase.from("harvest_logs").select("*").eq("farm_id", farmId).order("date", { ascending: false });
    setLogs(data || []);
  };

  useEffect(() => { fetchAll(); }, [farmId]);

  const add = async () => {
    if (!form.date || !form.block || !form.count) return;
    setLoading(true);
    await supabase.from("harvest_logs").insert({ farm_id: farmId, ...form, count: Number(form.count) });
    setForm({ date: "", block: "", count: "", notes: "" });
    setShowForm(false);
    await fetchAll();
    setLoading(false);
  };

  const remove = async (id: string) => {
    await supabase.from("harvest_logs").delete().eq("id", id);
    setLogs(logs.filter(l => l.id !== id));
  };

  const years = [...new Set(logs.map(l => l.date.slice(0, 4)))].sort().reverse();

  const filtered = logs.filter(l => {
    const yr = l.date.slice(0, 4);
    const mo = l.date.slice(5, 7);
    if (filterYear !== "all" && yr !== filterYear) return false;
    if (filterMonth !== "all" && mo !== filterMonth.padStart(2, "0")) return false;
    return true;
  });

  const total = filtered.reduce((a, l) => a + l.count, 0);

  // Monthly chart for selected year
  const monthlyData = MONTHS.map((label, i) => ({
    label,
    value: logs.filter(l => l.date.slice(0, 4) === filterYear && parseInt(l.date.slice(5, 7)) === i + 1).reduce((a, l) => a + l.count, 0),
    color: COLORS[i],
  }));

  // Block breakdown
  const blocks = [...new Set(filtered.map(l => l.block))];
  const blockData = blocks.map((b, i) => ({
    label: b,
    value: filtered.filter(l => l.block === b).reduce((a, l) => a + l.count, 0),
    color: COLORS[i % COLORS.length],
  })).sort((a, b) => b.value - a.value);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Harvest & Yield</h1>
          <p className="text-gray-500 text-sm mt-1">Log coconut harvests by block</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800">
          <Plus size={16} /> Log Harvest
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5">
        <select value={filterYear} onChange={e => setFilterYear(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
          <option value="all">All Years</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
          {!years.includes(new Date().getFullYear().toString()) && <option value={new Date().getFullYear().toString()}>{new Date().getFullYear()}</option>}
        </select>
        <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
          <option value="all">All Months</option>
          {MONTHS.map((m, i) => <option key={m} value={String(i + 1)}>{m}</option>)}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Coconuts", value: total.toLocaleString(), color: "text-green-700" },
          { label: "Sessions", value: filtered.length, color: "text-blue-600" },
          { label: "Avg per Session", value: filtered.length ? Math.round(total / filtered.length).toLocaleString() : 0, color: "text-amber-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Monthly chart */}
      {logs.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-5">
          <h2 className="font-semibold text-gray-700 mb-4">Monthly Harvest — {filterYear}</h2>
          <BarChart data={monthlyData} />
        </div>
      )}

      {/* Block breakdown */}
      {blockData.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-5">
          <h2 className="font-semibold text-gray-700 mb-4">By Block</h2>
          <div className="space-y-3">
            {blockData.map(({ label, value, color }) => {
              const pct = Math.round((value / total) * 100);
              return (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">🌴 {label}</span>
                    <span className="font-medium text-gray-800">{value.toLocaleString()} <span className="text-gray-400 text-xs">({pct}%)</span></span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-4">Log New Harvest</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: "date", label: "Date", type: "date" },
              { key: "block", label: "Block", placeholder: "Block A" },
              { key: "count", label: "Coconut Count", type: "number", placeholder: "420" },
              { key: "notes", label: "Notes", placeholder: "Any observations" },
            ].map(({ key, label, type = "text", placeholder }) => (
              <div key={key}>
                <label className="text-xs text-gray-500 mb-1 block">{label}</label>
                <input type={type} value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={add} disabled={loading} className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800 disabled:opacity-50">
              {loading ? "Saving..." : "Save"}
            </button>
            <button onClick={() => setShowForm(false)} className="text-gray-500 px-4 py-2 rounded-lg text-sm hover:bg-gray-100">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-700">Harvest Log</h2>
          <span className="text-xs text-gray-400">{filtered.length} entries</span>
        </div>
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">No harvests for selected period</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>{["Date", "Block", "Count", "Notes", ""].map(h => <th key={h} className="px-5 py-2.5 text-left text-xs font-medium text-gray-500">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(l => (
                <tr key={l.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-gray-500">{l.date}</td>
                  <td className="px-5 py-3 font-medium text-gray-800">{l.block}</td>
                  <td className="px-5 py-3"><span className="flex items-center gap-1.5 text-green-700 font-medium"><Wheat size={14} />{l.count.toLocaleString()}</span></td>
                  <td className="px-5 py-3 text-gray-400">{l.notes || "—"}</td>
                  <td className="px-5 py-3"><button onClick={() => remove(l.id)} className="text-gray-300 hover:text-red-400"><Trash2 size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
