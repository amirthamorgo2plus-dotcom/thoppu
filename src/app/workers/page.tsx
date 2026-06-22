"use client";
import { useState } from "react";
import { Plus, User, CheckCircle, Clock } from "lucide-react";

const defaultWorkers = [
  { id: 1, name: "Murugan", role: "Climber", phone: "98XXXXXXXX", wage: 800, today: "Harvest Block A", status: "done" },
  { id: 2, name: "Selvam", role: "Irrigation", phone: "97XXXXXXXX", wage: 650, today: "Gate valve check Block B", status: "in-progress" },
  { id: 3, name: "Rajan", role: "General", phone: "99XXXXXXXX", wage: 600, today: "Fertiliser application", status: "pending" },
];

const statusStyle: Record<string, string> = {
  done: "bg-green-100 text-green-700",
  "in-progress": "bg-yellow-100 text-yellow-700",
  pending: "bg-gray-100 text-gray-500",
};

export default function Workers() {
  const [workers, setWorkers] = useState(defaultWorkers);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", phone: "", wage: "", today: "" });

  const add = () => {
    if (!form.name) return;
    setWorkers([...workers, { id: Date.now(), ...form, wage: Number(form.wage), status: "pending" }]);
    setForm({ name: "", role: "", phone: "", wage: "", today: "" });
    setShowForm(false);
  };

  const cycleStatus = (id: number) => {
    const order = ["pending", "in-progress", "done"];
    setWorkers(workers.map(w => w.id === id ? { ...w, status: order[(order.indexOf(w.status) + 1) % 3] } : w));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Workers & Work</h1>
          <p className="text-gray-500 text-sm mt-1">Daily attendance, work allotment, and task status</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800">
          <Plus size={16} /> Add Worker
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Workers", value: workers.length },
          { label: "Tasks Done", value: workers.filter(w => w.status === "done").length },
          { label: "Daily Wages", value: `₹${workers.reduce((a, w) => a + w.wage, 0)}` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-gray-800">{value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-4">Add Worker</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: "name", placeholder: "Worker name" },
              { key: "role", placeholder: "Role (Climber, Irrigation...)" },
              { key: "phone", placeholder: "Phone number" },
              { key: "wage", placeholder: "Daily wage (₹)" },
            ].map(({ key, placeholder }) => (
              <input key={key} value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            ))}
            <input value={form.today} onChange={e => setForm({ ...form, today: e.target.value })} placeholder="Today's task" className="col-span-2 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={add} className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800">Save</button>
            <button onClick={() => setShowForm(false)} className="text-gray-500 px-4 py-2 rounded-lg text-sm hover:bg-gray-100">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700">Today&apos;s Roster</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {workers.map(w => (
            <div key={w.id} className="flex items-center gap-4 px-5 py-4">
              <div className="bg-green-100 text-green-700 rounded-full p-2"><User size={16} /></div>
              <div className="flex-1">
                <div className="font-medium text-gray-800 text-sm">{w.name} <span className="text-gray-400 font-normal">· {w.role}</span></div>
                <div className="text-xs text-gray-500 mt-0.5">{w.today}</div>
              </div>
              <div className="text-sm text-gray-600 font-medium">₹{w.wage}</div>
              <button onClick={() => cycleStatus(w.id)} className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 ${statusStyle[w.status]}`}>
                {w.status === "done" ? <CheckCircle size={12} /> : <Clock size={12} />}
                {w.status}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
