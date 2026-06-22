"use client";
import { use, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, AlertTriangle, CheckCircle, Trash2 } from "lucide-react";

type Problem = { id: string; type: string; title: string; block: string; date: string; solution: string; status: string };
const types = ["Pest", "Disease", "Soil", "Water", "Tree damage", "Equipment", "Other"];
const statusColor: Record<string, string> = { open: "bg-red-100 text-red-700", "in-progress": "bg-yellow-100 text-yellow-700", resolved: "bg-green-100 text-green-700" };

export default function Problems({ params }: { params: Promise<{ farmId: string }> }) {
  const { farmId } = use(params);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: "Pest", title: "", block: "", date: "", solution: "" });

  const fetch = async () => {
    const { data } = await supabase.from("problems").select("*").eq("farm_id", farmId).order("created_at", { ascending: false });
    setProblems(data || []);
  };

  useEffect(() => { fetch(); }, [farmId]);

  const add = async () => {
    if (!form.title) return;
    await supabase.from("problems").insert({ farm_id: farmId, ...form, status: "open" });
    setForm({ type: "Pest", title: "", block: "", date: "", solution: "" });
    setShowForm(false);
    fetch();
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("problems").update({ status }).eq("id", id);
    setProblems(problems.map(p => p.id === id ? { ...p, status } : p));
  };

  const remove = async (id: string) => {
    await supabase.from("problems").delete().eq("id", id);
    setProblems(problems.filter(p => p.id !== id));
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
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Describe briefly" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
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
        <div className="px-5 py-3 border-b border-gray-100"><h2 className="font-semibold text-gray-700">Problem Log</h2></div>
        {problems.length === 0 ? <div className="p-8 text-center text-gray-400 text-sm">No problems reported</div> : (
          <div className="divide-y divide-gray-50">
            {problems.map(p => (
              <div key={p.id} className="flex items-start gap-3 px-5 py-4">
                {p.status === "resolved" ? <CheckCircle className="text-green-500 mt-0.5 shrink-0" size={18} /> : <AlertTriangle className="text-red-400 mt-0.5 shrink-0" size={18} />}
                <div className="flex-1">
                  <div className="font-medium text-gray-800 text-sm">{p.title}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{p.type}{p.block ? ` · ${p.block}` : ""}{p.date ? ` · ${p.date}` : ""}</div>
                  {p.solution && <div className="text-xs text-gray-500 mt-1">→ {p.solution}</div>}
                </div>
                <select value={p.status} onChange={e => updateStatus(p.id, e.target.value)}
                  className={`text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer ${statusColor[p.status]}`}>
                  <option value="open">open</option>
                  <option value="in-progress">in-progress</option>
                  <option value="resolved">resolved</option>
                </select>
                <button onClick={() => remove(p.id)} className="text-gray-300 hover:text-red-400 ml-1"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
