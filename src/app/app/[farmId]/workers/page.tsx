"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, User, CheckCircle, Clock, Trash2 } from "lucide-react";

type Worker = { id: string; name: string; role: string; phone: string; wage: number };
type WorkLog = { id: string; worker_name: string; task: string; status: string; date: string };

const statusStyle: Record<string, string> = {
  done: "bg-green-100 text-green-700",
  "in-progress": "bg-yellow-100 text-yellow-700",
  pending: "bg-gray-100 text-gray-500",
};

const nextStatus: Record<string, string> = { pending: "in-progress", "in-progress": "done", done: "pending" };

export default function Workers({ params }: { params: { farmId: string } }) {
  const { farmId } = params;
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [logs, setLogs] = useState<WorkLog[]>([]);
  const [showWorkerForm, setShowWorkerForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [wForm, setWForm] = useState({ name: "", role: "", phone: "", wage: "" });
  const [tForm, setTForm] = useState({ worker_name: "", task: "", date: new Date().toISOString().slice(0, 10) });

  const fetchAll = async () => {
    const [w, l] = await Promise.all([
      supabase.from("workers").select("*").eq("farm_id", farmId).order("name"),
      supabase.from("work_logs").select("*").eq("farm_id", farmId).eq("date", new Date().toISOString().slice(0, 10)).order("created_at"),
    ]);
    setWorkers(w.data || []);
    setLogs(l.data || []);
  };

  useEffect(() => { fetchAll(); }, [farmId]);

  const addWorker = async () => {
    if (!wForm.name) return;
    await supabase.from("workers").insert({ farm_id: farmId, ...wForm, wage: Number(wForm.wage) });
    setWForm({ name: "", role: "", phone: "", wage: "" });
    setShowWorkerForm(false);
    fetchAll();
  };

  const addTask = async () => {
    if (!tForm.task) return;
    await supabase.from("work_logs").insert({ farm_id: farmId, ...tForm, status: "pending" });
    setTForm({ worker_name: "", task: "", date: new Date().toISOString().slice(0, 10) });
    setShowTaskForm(false);
    fetchAll();
  };

  const cycleStatus = async (log: WorkLog) => {
    const status = nextStatus[log.status];
    await supabase.from("work_logs").update({ status }).eq("id", log.id);
    setLogs(logs.map(l => l.id === log.id ? { ...l, status } : l));
  };

  const deleteLog = async (id: string) => {
    await supabase.from("work_logs").delete().eq("id", id);
    setLogs(logs.filter(l => l.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Workers & Work</h1>
          <p className="text-gray-500 text-sm mt-1">Today&apos;s roster and task tracking</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowTaskForm(!showTaskForm)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            <Plus size={16} /> Assign Task
          </button>
          <button onClick={() => setShowWorkerForm(!showWorkerForm)} className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800">
            <Plus size={16} /> Add Worker
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{workers.length}</div>
          <div className="text-sm text-gray-500 mt-0.5">Total Workers</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{logs.filter(l => l.status === "done").length}</div>
          <div className="text-sm text-gray-500 mt-0.5">Tasks Done Today</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">₹{workers.reduce((a, w) => a + w.wage, 0)}</div>
          <div className="text-sm text-gray-500 mt-0.5">Daily Wages Total</div>
        </div>
      </div>

      {showWorkerForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-4">Add Worker</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: "name", placeholder: "Worker name" },
              { key: "role", placeholder: "Role (Climber, Irrigation...)" },
              { key: "phone", placeholder: "Phone" },
              { key: "wage", placeholder: "Daily wage (₹)" },
            ].map(({ key, placeholder }) => (
              <input key={key} value={(wForm as any)[key]} onChange={e => setWForm({ ...wForm, [key]: e.target.value })} placeholder={placeholder} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={addWorker} className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800">Save</button>
            <button onClick={() => setShowWorkerForm(false)} className="text-gray-500 px-4 py-2 rounded-lg text-sm hover:bg-gray-100">Cancel</button>
          </div>
        </div>
      )}

      {showTaskForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-4">Assign Task</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Worker</label>
              <select value={tForm.worker_name} onChange={e => setTForm({ ...tForm, worker_name: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                <option value="">Select worker</option>
                {workers.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Date</label>
              <input type="date" value={tForm.date} onChange={e => setTForm({ ...tForm, date: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-gray-500 mb-1 block">Task</label>
              <input value={tForm.task} onChange={e => setTForm({ ...tForm, task: e.target.value })} placeholder="e.g. Harvest Block A" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={addTask} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Assign</button>
            <button onClick={() => setShowTaskForm(false)} className="text-gray-500 px-4 py-2 rounded-lg text-sm hover:bg-gray-100">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
        <div className="px-5 py-3 border-b border-gray-100"><h2 className="font-semibold text-gray-700">Today&apos;s Tasks</h2></div>
        {logs.length === 0 ? <div className="p-8 text-center text-gray-400 text-sm">No tasks assigned today</div> : (
          <div className="divide-y divide-gray-50">
            {logs.map(l => (
              <div key={l.id} className="flex items-center gap-4 px-5 py-4">
                <User className="text-green-600" size={16} />
                <div className="flex-1">
                  <div className="font-medium text-gray-800 text-sm">{l.worker_name || "Unassigned"}</div>
                  <div className="text-xs text-gray-500">{l.task}</div>
                </div>
                <button onClick={() => cycleStatus(l)} className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 ${statusStyle[l.status]}`}>
                  {l.status === "done" ? <CheckCircle size={12} /> : <Clock size={12} />} {l.status}
                </button>
                <button onClick={() => deleteLog(l.id)} className="text-gray-300 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100"><h2 className="font-semibold text-gray-700">Worker Roster</h2></div>
        {workers.length === 0 ? <div className="p-8 text-center text-gray-400 text-sm">No workers added yet</div> : (
          <div className="divide-y divide-gray-50">
            {workers.map(w => (
              <div key={w.id} className="flex items-center gap-4 px-5 py-4">
                <div className="bg-green-100 text-green-700 rounded-full p-2"><User size={14} /></div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800 text-sm">{w.name} <span className="text-gray-400 font-normal">· {w.role}</span></div>
                  <div className="text-xs text-gray-400">{w.phone}</div>
                </div>
                <div className="text-sm font-medium text-gray-600">₹{w.wage}/day</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
