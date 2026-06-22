"use client";
import { useState } from "react";
import { Plus, Wheat } from "lucide-react";

const defaultLogs = [
  { id: 1, date: "2026-06-10", block: "Block A", count: 420, notes: "Good yield, dry weather" },
  { id: 2, date: "2026-05-15", block: "Block B", count: 380, notes: "Some trees skipped" },
  { id: 3, date: "2026-04-20", block: "Block A", count: 410, notes: "" },
  { id: 4, date: "2026-03-18", block: "Block C", count: 290, notes: "Pest damage on NW corner" },
];

export default function Harvest() {
  const [logs, setLogs] = useState(defaultLogs);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: "", block: "", count: "", notes: "" });

  const add = () => {
    if (!form.date || !form.block || !form.count) return;
    setLogs([{ id: Date.now(), ...form, count: Number(form.count) }, ...logs]);
    setForm({ date: "", block: "", count: "", notes: "" });
    setShowForm(false);
  };

  const total = logs.reduce((a, l) => a + l.count, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Harvest & Yield</h1>
          <p className="text-gray-500 text-sm mt-1">Log coconut harvests by block and track yearly yield</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800">
          <Plus size={16} /> Log Harvest
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{total.toLocaleString()}</div>
          <div className="text-sm text-gray-500 mt-0.5">Total Coconuts (all logs)</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{logs.length}</div>
          <div className="text-sm text-gray-500 mt-0.5">Harvest Sessions</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{Math.round(total / logs.length)}</div>
          <div className="text-sm text-gray-500 mt-0.5">Avg per Session</div>
        </div>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-4">Log New Harvest</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Date</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Block</label>
              <input value={form.block} onChange={e => setForm({ ...form, block: e.target.value })} placeholder="Block A" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Coconut Count</label>
              <input type="number" value={form.count} onChange={e => setForm({ ...form, count: e.target.value })} placeholder="420" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Notes</label>
              <input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Any observations" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={add} className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800">Save</button>
            <button onClick={() => setShowForm(false)} className="text-gray-500 px-4 py-2 rounded-lg text-sm hover:bg-gray-100">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700">Harvest Log</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["Date", "Block", "Count", "Notes"].map(h => (
                <th key={h} className="px-5 py-2.5 text-left text-xs font-medium text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {logs.map(l => (
              <tr key={l.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 text-gray-700">{l.date}</td>
                <td className="px-5 py-3 font-medium text-gray-800">{l.block}</td>
                <td className="px-5 py-3">
                  <span className="flex items-center gap-1.5 text-green-700 font-medium">
                    <Wheat size={14} /> {l.count.toLocaleString()}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-400">{l.notes || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
