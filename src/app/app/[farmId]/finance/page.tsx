"use client";
import { use, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, TrendingUp, TrendingDown, IndianRupee, Zap, FileText } from "lucide-react";

type Entry = { id: string; type: "income" | "expense"; category: string; amount: number; date: string; notes: string };

const expenseCategories = ["Fertiliser", "Pesticide", "Labour", "Equipment", "Fuel", "Electricity (EB)", "Land Tax", "Water", "Transport", "Repair", "Other"];
const incomeCategories = ["Coconut Sale", "Copra Sale", "Coir Sale", "Other"];

const categoryEmoji: Record<string, string> = {
  "Fertiliser": "🌿", "Pesticide": "🐛", "Labour": "👷", "Equipment": "🔧",
  "Fuel": "⛽", "Electricity (EB)": "⚡", "Land Tax": "📋", "Water": "💧",
  "Transport": "🚛", "Repair": "🔨", "Other": "📦",
  "Coconut Sale": "🥥", "Copra Sale": "🪨", "Coir Sale": "🌾",
};

export default function FinancePage({ params }: { params: Promise<{ farmId: string }> }) {
  const { farmId } = use(params);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState<"all" | "income" | "expense">("all");
  const [form, setForm] = useState({ type: "expense" as "income" | "expense", category: "Fertiliser", amount: "", date: new Date().toISOString().slice(0, 10), notes: "" });

  const fetchEntries = async () => {
    const { data } = await supabase.from("finance_entries").select("*").eq("farm_id", farmId).order("date", { ascending: false });
    setEntries(data || []);
  };

  useEffect(() => { fetchEntries(); }, [farmId]);

  const add = async () => {
    if (!form.amount || !form.date) return;
    await supabase.from("finance_entries").insert({ farm_id: farmId, ...form, amount: parseFloat(form.amount) });
    setForm({ type: "expense", category: "Fertiliser", amount: "", date: new Date().toISOString().slice(0, 10), notes: "" });
    setShowForm(false);
    fetchEntries();
  };

  const remove = async (id: string) => {
    await supabase.from("finance_entries").delete().eq("id", id);
    setEntries(entries.filter(e => e.id !== id));
  };

  const totalIncome = entries.filter(e => e.type === "income").reduce((s, e) => s + e.amount, 0);
  const totalExpense = entries.filter(e => e.type === "expense").reduce((s, e) => s + e.amount, 0);
  const profit = totalIncome - totalExpense;

  const thisMonth = new Date().toISOString().slice(0, 7);
  const monthIncome = entries.filter(e => e.type === "income" && e.date.startsWith(thisMonth)).reduce((s, e) => s + e.amount, 0);
  const monthExpense = entries.filter(e => e.type === "expense" && e.date.startsWith(thisMonth)).reduce((s, e) => s + e.amount, 0);

  // Group expenses by category
  const expByCategory = expenseCategories.map(cat => ({
    cat, total: entries.filter(e => e.type === "expense" && e.category === cat).reduce((s, e) => s + e.amount, 0),
  })).filter(x => x.total > 0).sort((a, b) => b.total - a.total);

  const filtered = entries.filter(e => tab === "all" ? true : e.type === tab);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Finance</h1>
          <p className="text-gray-500 text-sm mt-1">Income, expenses, EB bill, land tax</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800">
          <Plus size={16} /> Add Entry
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-700 text-white rounded-xl p-4">
          <TrendingUp size={18} className="mb-2 text-green-300" />
          <div className="text-2xl font-bold">₹{totalIncome.toLocaleString()}</div>
          <div className="text-green-300 text-xs mt-1">Total Income</div>
        </div>
        <div className="bg-red-600 text-white rounded-xl p-4">
          <TrendingDown size={18} className="mb-2 text-red-300" />
          <div className="text-2xl font-bold">₹{totalExpense.toLocaleString()}</div>
          <div className="text-red-300 text-xs mt-1">Total Expenses</div>
        </div>
        <div className={`${profit >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"} border rounded-xl p-4`}>
          <IndianRupee size={18} className={`mb-2 ${profit >= 0 ? "text-green-600" : "text-red-600"}`} />
          <div className={`text-2xl font-bold ${profit >= 0 ? "text-green-700" : "text-red-700"}`}>₹{Math.abs(profit).toLocaleString()}</div>
          <div className="text-gray-500 text-xs mt-1">{profit >= 0 ? "Net Profit" : "Net Loss"}</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <FileText size={18} className="mb-2 text-blue-500" />
          <div className="text-2xl font-bold text-gray-800">₹{monthExpense.toLocaleString()}</div>
          <div className="text-gray-400 text-xs mt-1">This Month Expense</div>
        </div>
      </div>

      {/* Expense breakdown bar chart */}
      {expByCategory.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
          <h2 className="font-semibold text-gray-700 mb-4">Expense Breakdown</h2>
          <div className="space-y-3">
            {expByCategory.map(({ cat, total }) => {
              const pct = Math.round((total / totalExpense) * 100);
              return (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{categoryEmoji[cat] || "📦"} {cat}</span>
                    <span className="font-medium text-gray-800">₹{total.toLocaleString()} <span className="text-gray-400 text-xs">({pct}%)</span></span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-600 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-4">Add Entry</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as any, category: e.target.value === "income" ? "Coconut Sale" : "Fertiliser" })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                {(form.type === "expense" ? expenseCategories : incomeCategories).map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Amount (₹)</label>
              <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
                placeholder="e.g. 5000" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Date</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-gray-500 mb-1 block">Notes</label>
              <input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                placeholder="e.g. 50kg urea from Murugan Agro" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={add} className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800">Save</button>
            <button onClick={() => setShowForm(false)} className="text-gray-500 px-4 py-2 rounded-lg text-sm hover:bg-gray-100">Cancel</button>
          </div>
        </div>
      )}

      {/* Ledger */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-700">Ledger</h2>
          <div className="flex gap-1">
            {(["all", "income", "expense"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${tab === t ? "bg-green-700 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No entries yet</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map(e => (
              <div key={e.id} className="flex items-center gap-4 px-5 py-3">
                <div className="text-xl">{categoryEmoji[e.category] || "📦"}</div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-800">{e.category}</div>
                  <div className="text-xs text-gray-400">{e.date}{e.notes ? ` · ${e.notes}` : ""}</div>
                </div>
                <div className={`text-sm font-bold ${e.type === "income" ? "text-green-600" : "text-red-500"}`}>
                  {e.type === "income" ? "+" : "-"}₹{e.amount.toLocaleString()}
                </div>
                <button onClick={() => remove(e.id)} className="text-gray-300 hover:text-red-400 ml-1"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        )}
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 flex justify-between text-sm">
            <span className="text-gray-500">This month: <span className="text-green-600 font-medium">+₹{monthIncome.toLocaleString()}</span> / <span className="text-red-500 font-medium">-₹{monthExpense.toLocaleString()}</span></span>
            <span className={`font-semibold ${profit >= 0 ? "text-green-700" : "text-red-600"}`}>Net: ₹{profit.toLocaleString()}</span>
          </div>
        )}
      </div>
    </div>
  );
}
