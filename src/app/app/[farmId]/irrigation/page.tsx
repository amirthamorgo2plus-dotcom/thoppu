"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Droplets, Plus, Zap, Trash2 } from "lucide-react";

type Valve = { id: string; name: string; block: string; status: string; last_run: string; duration: string };
type Borewell = { id: string; name: string; depth: string; motor: string; feeds: string; last_service: string };

export default function Irrigation({ params }: { params: { farmId: string } }) {
  const { farmId } = params;
  const [valves, setValves] = useState<Valve[]>([]);
  const [borewells, setBorewells] = useState<Borewell[]>([]);
  const [showValve, setShowValve] = useState(false);
  const [showBore, setShowBore] = useState(false);
  const [vForm, setVForm] = useState({ name: "", block: "", duration: "" });
  const [bForm, setBForm] = useState({ name: "", depth: "", motor: "", feeds: "", last_service: "" });

  const fetchAll = async () => {
    const [v, b] = await Promise.all([
      supabase.from("irrigation_valves").select("*").eq("farm_id", farmId).order("created_at"),
      supabase.from("borewells").select("*").eq("farm_id", farmId).order("created_at"),
    ]);
    setValves(v.data || []);
    setBorewells(b.data || []);
  };

  useEffect(() => { fetchAll(); }, [farmId]);

  const toggleValve = async (v: Valve) => {
    const status = v.status === "open" ? "closed" : "open";
    const last_run = status === "open" ? new Date().toISOString().slice(0, 10) : v.last_run;
    await supabase.from("irrigation_valves").update({ status, last_run }).eq("id", v.id);
    setValves(valves.map(val => val.id === v.id ? { ...val, status, last_run } : val));
  };

  const addValve = async () => {
    if (!vForm.name) return;
    await supabase.from("irrigation_valves").insert({ farm_id: farmId, ...vForm, status: "closed" });
    setVForm({ name: "", block: "", duration: "" });
    setShowValve(false);
    fetchAll();
  };

  const addBorewell = async () => {
    if (!bForm.name) return;
    await supabase.from("borewells").insert({ farm_id: farmId, ...bForm });
    setBForm({ name: "", depth: "", motor: "", feeds: "", last_service: "" });
    setShowBore(false);
    fetchAll();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Irrigation</h1>
          <p className="text-gray-500 text-sm mt-1">Gate valves and borewell management</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowBore(!showBore)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            <Plus size={16} /> Add Borewell
          </button>
          <button onClick={() => setShowValve(!showValve)} className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800">
            <Plus size={16} /> Add Valve
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{valves.filter(v => v.status === "open").length}</div>
          <div className="text-sm text-gray-500 mt-0.5">Valves Open</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{valves.filter(v => v.status === "closed").length}</div>
          <div className="text-sm text-gray-500 mt-0.5">Valves Closed</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{borewells.length}</div>
          <div className="text-sm text-gray-500 mt-0.5">Borewells</div>
        </div>
      </div>

      {showValve && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-4">Add Gate Valve</h2>
          <div className="grid grid-cols-3 gap-3">
            {[{ k: "name", p: "Valve name" }, { k: "block", p: "Block it feeds" }, { k: "duration", p: "Usual duration (e.g. 3 hrs)" }].map(({ k, p }) => (
              <input key={k} value={(vForm as any)[k]} onChange={e => setVForm({ ...vForm, [k]: e.target.value })} placeholder={p} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={addValve} className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800">Save</button>
            <button onClick={() => setShowValve(false)} className="text-gray-500 px-4 py-2 rounded-lg text-sm hover:bg-gray-100">Cancel</button>
          </div>
        </div>
      )}

      {showBore && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-4">Add Borewell</h2>
          <div className="grid grid-cols-2 gap-3">
            {[{ k: "name", p: "Borewell name" }, { k: "depth", p: "Depth (e.g. 200 ft)" }, { k: "motor", p: "Motor (e.g. 5 HP)" }, { k: "feeds", p: "Feeds (e.g. Block A, B)" }].map(({ k, p }) => (
              <input key={k} value={(bForm as any)[k]} onChange={e => setBForm({ ...bForm, [k]: e.target.value })} placeholder={p} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            ))}
            <div className="col-span-2">
              <label className="text-xs text-gray-500 mb-1 block">Last Service Date</label>
              <input type="date" value={bForm.last_service} onChange={e => setBForm({ ...bForm, last_service: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={addBorewell} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Save</button>
            <button onClick={() => setShowBore(false)} className="text-gray-500 px-4 py-2 rounded-lg text-sm hover:bg-gray-100">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-5">
        <div className="px-5 py-3 border-b border-gray-100"><h2 className="font-semibold text-gray-700">Gate Valves</h2></div>
        {valves.length === 0 ? <div className="p-8 text-center text-gray-400 text-sm">No valves added yet</div> : (
          <div className="divide-y divide-gray-50">
            {valves.map(v => (
              <div key={v.id} className="flex items-center gap-4 px-5 py-4">
                <Droplets className={v.status === "open" ? "text-blue-500" : "text-gray-300"} size={20} />
                <div className="flex-1">
                  <div className="font-medium text-gray-800 text-sm">{v.name}{v.block ? ` · ${v.block}` : ""}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{v.last_run ? `Last run: ${v.last_run}` : "Not run yet"}{v.duration ? ` · ${v.duration}` : ""}</div>
                </div>
                <button onClick={() => toggleValve(v)} className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${v.status === "open" ? "bg-blue-100 text-blue-700 hover:bg-blue-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                  {v.status === "open" ? "● Open" : "○ Closed"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
          <Zap size={16} className="text-yellow-500" />
          <h2 className="font-semibold text-gray-700">Borewells</h2>
        </div>
        {borewells.length === 0 ? <div className="p-8 text-center text-gray-400 text-sm">No borewells added yet</div> : (
          <div className="divide-y divide-gray-50">
            {borewells.map(b => (
              <div key={b.id} className="px-5 py-4">
                <div className="font-medium text-gray-800 text-sm">{b.name}</div>
                <div className="grid grid-cols-2 gap-x-6 mt-2 text-xs text-gray-500">
                  {b.depth && <span>Depth: <span className="text-gray-700">{b.depth}</span></span>}
                  {b.motor && <span>Motor: <span className="text-gray-700">{b.motor}</span></span>}
                  {b.feeds && <span>Feeds: <span className="text-gray-700">{b.feeds}</span></span>}
                  {b.last_service && <span>Last service: <span className="text-gray-700">{b.last_service}</span></span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
