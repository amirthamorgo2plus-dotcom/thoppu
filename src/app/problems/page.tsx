"use client";
import { useState } from "react";
import { Plus, AlertTriangle, CheckCircle } from "lucide-react";

const types = ["Pest", "Disease", "Soil", "Water", "Tree damage", "Equipment", "Other"];

const defaultProblems = [
  { id: 1, type: "Pest", title: "Rhinoceros beetle attack", block: "Block A", date: "2026-06-18", solution: "Applied neem oil + manual removal", status: "resolved" },
  { id: 2, type: "Disease", title: "Bud rot suspected", block: "Block C", date: "2026-06-20", solution: "Awaiting TNAU advice", status: "open" },
  { id: 3, type: "Water", title: "Borewell #2 pressure low", block: "Block C", date: "2026-06-15", solution: "Motor service scheduled", status: "in-progress" },
];

const statusColor: Record<string, string> = {
  open: "bg-red-100 text-red-700",
  "in-progress": "bg-yellow-100 text-yellow-700",
  resolved: "bg-green-100 text-green-700",
};

export default function Problems() {
  const [problems, setProblems] = useState(defaultProblems);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: "Pest", title: "", block: "", date: "", solution: "" });

  const add = () => {
    if (!form.title) return;
    setProblems([{ id: Date.now(), ...form, status: "open" }, ...problems]);
    setForm({ type: "Pest", title: "", block: "", date: "", solution: "" });
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Problems</h1>
          <p className="text-gray-500 text-sm mt-1">Track pest, disease, and maintenance issues</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700">
          <Plus size={16} /> Report Problem
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Open", count: problems.filter(p => p.status === "open").length, color: "text-red-600" },
          { label: "In Progress", count: problems.filter(p => p.status === "in-progress").length, color: "text-yellow-600" },
          { label: "Resolved", count: problems.filter(p => p.status === "resolved").length, color: "text-green-600" },
        ].map(({ label, count, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <div className={`text-2xl font-bold ${color}`}>{count}</div>
            <div className="text-sm text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-4">Report Problem</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                {types.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Block</label>
              <input value={form.block} onChange={e => setForm({ ...form, block: e.target.value })} placeholder="Block A" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-gray-500 mb-1 block">Problem Title</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Describe the problem briefly" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Date Noticed</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Solution / Action taken</label>
              <input value={form.solution} onChange={e => setForm({ ...form, solution: e.target.value })} placeholder="What was done?" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={add} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700">Save</button>
            <button onClick={() => setShowForm(false)} className="text-gray-500 px-4 py-2 rounded-lg text-sm hover:bg-gray-100">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700">Problem Log</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {problems.map(p => (
            <div key={p.id} className="flex items-start gap-3 px-5 py-4">
              {p.status === "resolved"
                ? <CheckCircle className="text-green-500 mt-0.5" size={18} />
                : <AlertTriangle className="text-red-400 mt-0.5" size={18} />
              }
              <div className="flex-1">
                <div className="font-medium text-gray-800 text-sm">{p.title}</div>
                <div className="text-xs text-gray-400 mt-0.5">{p.type} · {p.block} · {p.date}</div>
                {p.solution && <div className="text-xs text-gray-500 mt-1">→ {p.solution}</div>}
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[p.status]}`}>{p.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
