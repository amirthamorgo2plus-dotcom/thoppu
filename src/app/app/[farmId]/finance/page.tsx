"use client";
import { use, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, TrendingUp, TrendingDown, IndianRupee, FileText } from "lucide-react";

type Entry = { id: string; type: "income" | "expense"; category: string; amount: number; date: string; notes: string };

const expenseCategories = ["Fertiliser", "Pesticide", "Labour", "Equipment", "Fuel", "Electricity (EB)", "Land Tax", "Water", "Transport", "Repair", "Other"];
const incomeCategories = ["Coconut Sale", "Copra Sale", "Coir Sale", "Other"];
const categoryEmoji: Record<string, string> = {
  "Fertiliser": "🌿", "Pesticide": "🐛", "Labour": "👷", "Equipment": "🔧",
  "Fuel": "⛽", "Electricity (EB)": "⚡", "Land Tax": "📋", "Water": "💧",
  "Transport": "🚛", "Repair": "🔨", "Other": "📦",
  "Coconut Sale": "🥥", "Copra Sale": "🪨", "Coir Sale": "🌾",
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const EXP_COLORS = ["#fca5a5","#fcd34d","#bfdbfe","#c4b5fd","#f9a8d4","#86efac","#67e8f9","#fca5a5","#a5f3fc","#fde68a","#d9f99d"];

export default function FinancePage({ params }: { params: Promise<{ farmId: string }> }) {
  const { farmId } = use(params);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState<"all" | "income" | "expense">("all");
  const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());
  const [filterMonth, setFilterMonth] = useState("all");
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

  const years = [...new Set(entries.map(e => e.date.slice(0, 4)))].sort().reverse();

  const filtered = entries.filter(e => {
    const yr = e.date.slice(0, 4);
    const mo = parseInt(e.date.slice(5, 7));
    if (filterYear !== "all" && yr !== filterYear) return false;
    if (filterMonth !== "all" && mo !== parseInt(filterMonth)) return false;
    return true;
  });

  const filteredByTab = filtered.filter(e => tab === "all" ? true : e.type === tab);

  const totalIncome = filtered.filter(e => e.type === "income").reduce((s, e) => s + e.amount, 0);
  const totalExpense = filtered.filter(e => e.type === "expense").reduce((s, e) => s + e.amount, 0);
  const profit = totalIncome - totalExpense;

  // All-time for summary
  const allIncome = entries.filter(e => e.type === "income").reduce((s, e) => s + e.amount, 0);
  const allExpense = entries.filter(e => e.type === "expense").reduce((s, e) => s + e.amount, 0);

  // Expense breakdown (filtered)
  const expByCategory = expenseCategories.map((cat, i) => ({
    cat, color: EXP_COLORS[i % EXP_COLORS.length],
    total: filtered.filter(e => e.type === "expense" && e.category === cat).reduce((s, e) => s + e.amount, 0),
  })).filter(x => x.total > 0).sort((a, b) => b.total - a.total);

  // Monthly income vs expense chart
  const now = new Date();
  const monthlyChart = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    return {
      label: MONTHS[d.getMonth()],
      income: entries.filter(e => e.type === "income" && e.date.startsWith(key)).reduce((s, e) => s + e.amount, 0),
      expense: entries.filter(e => e.type === "expense" && e.date.startsWith(key)).reduce((s, e) => s + e.amount, 0),
    };
  });
  const chartMax = Math.max(...monthlyChart.flatMap(m => [m.income, m.expense]), 1);

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

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
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

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-700 text-white rounded-xl p-4">
          <TrendingUp size={18} className="mb-2 text-green-300" />
          <div className="text-2xl font-bold">₹{totalIncome.toLocaleString()}</div>
          <div className="text-green-300 text-xs mt-1">Income {filterMonth !== "all" || filterYear !== "all" ? "(filtered)" : ""}</div>
        </div>
        <div className="bg-red-500 text-white rounded-xl p-4">
          <TrendingDown size={18} className="mb-2 text-red-200" />
          <div className="text-2xl font-bold">₹{totalExpense.toLocaleString()}</div>
          <div className="text-red-200 text-xs mt-1">Expenses {filterMonth !== "all" || filterYear !== "all" ? "(filtered)" : ""}</div>
        </div>
        <div className={`${profit >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"} border rounded-xl p-4`}>
          <IndianRupee size={18} className={`mb-2 ${profit >= 0 ? "text-green-600" : "text-red-600"}`} />
          <div className={`text-2xl font-bold ${profit >= 0 ? "text-green-700" : "text-red-700"}`}>₹{Math.abs(profit).toLocaleString()}</div>
          <div className="text-gray-500 text-xs mt-1">{profit >= 0 ? "Net Profit" : "Net Loss"}</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <FileText size={18} className="mb-2 text-blue-500" />
          <div className="text-2xl font-bold text-gray-800">₹{(allIncome - allExpense).toLocaleString()}</div>
          <div className="text-gray-400 text-xs mt-1">All-time Net</div>
        </div>
      </div>

      {/* Monthly chart */}
      {entries.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-5">
          <h2 className="font-semibold text-gray-700 mb-4">Income vs Expenses — Last 6 Months</h2>
          <div className="flex items-end gap-3 h-28">
            {monthlyChart.map(({ label, income, expense }) => (
              <div key={label} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex gap-0.5 items-end" style={{ height: "90px" }}>
                  <div className="flex-1 rounded-t-sm" style={{ height: `${Math.max((income / chartMax) * 90, income > 0 ? 3 : 0)}px`, background: "#86efac" }} />
                  <div className="flex-1 rounded-t-sm" style={{ height: `${Math.max((expense / chartMax) * 90, expense > 0 ? 3 : 0)}px`, background: "#fca5a5" }} />
                </div>
                <span className="text-xs text-gray-400">{label}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-3 h-3 rounded-sm inline-block bg-green-300" /> Income</span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-3 h-3 rounded-sm inline-block bg-red-300" /> Expenses</span>
          </div>
        </div>
      )}

      {/* Expense breakdown bar chart */}
      {expByCategory.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
          <h2 className="font-semibold text-gray-700 mb-4">Expense Breakdown</h2>
          <div className="space-y-3">
            {expByCategory.map(({ cat, total, color }) => {
              const pct = Math.round((total / totalExpense) * 100);
              return (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{categoryEmoji[cat] || "📦"} {cat}</span>
                    <span className="font-medium text-gray-800">₹{total.toLocaleString()} <span className="text-gray-400 text-xs">({pct}%)</span></span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
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
        {filteredByTab.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No entries for selected period</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredByTab.map(e => (
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
        {filteredByTab.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 flex justify-between text-sm">
            <span className="text-gray-500">
              Income: <span className="text-green-600 font-medium">₹{totalIncome.toLocaleString()}</span>
              {" · "}
              Expense: <span className="text-red-500 font-medium">₹{totalExpense.toLocaleString()}</span>
            </span>
            <span className={`font-semibold ${profit >= 0 ? "text-green-700" : "text-red-600"}`}>Net: ₹{profit.toLocaleString()}</span>
          </div>
        )}
      </div>
    </div>
  );
}
