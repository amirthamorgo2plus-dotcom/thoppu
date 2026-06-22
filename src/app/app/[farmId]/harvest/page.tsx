"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Wheat, Trash2 } from "lucide-react";

type Log = { id: string; date: string; block: string; count: number; notes: string };

export default function Harvest({ params }: { params: { farmId: string } }) {
  const { farmId } = params;
  const [logs, setLogs] = useState<Log[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: "", block: "", count: "", notes: "" });
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    const { data } = await supabase.from("harvest_logs").select("*").eq("farm_id", farmId).order("date", { ascending: false });
    setLogs(data || []);
  };

  useEffect(() => { fetch(); }, [farmId]);

  const add = async () => {
    if (!form.date || !form.block || !form.count) return;
    setLoading(true);
    await supabase.from("harvest_logs").insert({ farm_id: farmId, ...form, count: Number(form.count) });
    setForm({ date: "", block: "", count: "", notes: "" });
    setShowForm(false);
    await fetch();
    setLoading(false);
  };

  const remove = async (id: string) => {
    await supabase.from("harvest_logs").delete().eq("id", id);
    setLogs(logs.filter(l => l.id !== id));
  };

  const total = logs.reduce((a, l) => a + l.count, 0);

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

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Coconuts", value: total.toLocaleString() },
          { label: "Harvest Sessions", value: logs.length },
          { label: "Avg per Session", value: logs.length ? Math.round(total / logs.length) : 0 },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-gray-800">{value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
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
        <div className="px-5 py-3 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700">Harvest Log</h2>
        </div>
        {logs.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">No harvests logged yet</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>{["Date", "Block", "Count", "Notes", ""].map(h => <th key={h} className="px-5 py-2.5 text-left text-xs font-medium text-gray-500">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {logs.map(l => (
                <tr key={l.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-gray-700">{l.date}</td>
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
