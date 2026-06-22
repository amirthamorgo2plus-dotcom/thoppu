"use client";
import { use, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { MapPin, Droplets, Home, TreePine, Plus, Trash2 } from "lucide-react";

const markerTypes = [
  { type: "block", label: "Block / Partition", icon: TreePine, color: "text-green-600" },
  { type: "borewell", label: "Borewell", icon: Droplets, color: "text-blue-600" },
  { type: "valve", label: "Gate Valve", icon: MapPin, color: "text-orange-500" },
  { type: "house", label: "House / Building", icon: Home, color: "text-purple-600" },
];

type Marker = { id: string; type: string; label: string; lat: string; lng: string; notes: string };

export default function FarmMap({ params }: { params: Promise<{ farmId: string }> }) {
  const { farmId } = use(params);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: "block", label: "", lat: "", lng: "", notes: "" });

  const fetch = async () => {
    const { data } = await supabase.from("farm_locations").select("*").eq("farm_id", farmId).order("created_at");
    setMarkers(data || []);
  };

  useEffect(() => { fetch(); }, [farmId]);

  const add = async () => {
    if (!form.label) return;
    await supabase.from("farm_locations").insert({ farm_id: farmId, ...form });
    setForm({ type: "block", label: "", lat: "", lng: "", notes: "" });
    setShowForm(false);
    fetch();
  };

  const remove = async (id: string) => {
    await supabase.from("farm_locations").delete().eq("id", id);
    setMarkers(markers.filter(m => m.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Farm Map</h1>
          <p className="text-gray-500 text-sm mt-1">Mark blocks, borewells, gate valves, and buildings</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800">
          <Plus size={16} /> Add Location
        </button>
      </div>

      <div className="bg-green-50 border-2 border-dashed border-green-200 rounded-xl h-64 flex flex-col items-center justify-center mb-6 text-center px-4">
        <MapPin className="text-green-400 mb-2" size={36} />
        <p className="text-green-700 font-medium">Live Satellite Map Coming Soon</p>
        <p className="text-green-500 text-sm mt-1">Share the GPS coordinates of your farm boundary and I&apos;ll wire up the interactive map.</p>
        <p className="text-green-400 text-xs mt-2">Leaflet + OpenStreetMap · 100% free</p>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-4">Add Location</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                {markerTypes.map(m => <option key={m.type} value={m.type}>{m.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Name / Label</label>
              <input value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} placeholder="e.g. Block A" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Latitude</label>
              <input value={form.lat} onChange={e => setForm({ ...form, lat: e.target.value })} placeholder="11.0168" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Longitude</label>
              <input value={form.lng} onChange={e => setForm({ ...form, lng: e.target.value })} placeholder="76.9558" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-gray-500 mb-1 block">Notes</label>
              <input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="e.g. 350 trees, NE corner" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
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
          <h2 className="font-semibold text-gray-700">Locations ({markers.length})</h2>
        </div>
        {markers.length === 0 ? <div className="p-8 text-center text-gray-400 text-sm">No locations added yet</div> : (
          <div className="divide-y divide-gray-50">
            {markers.map(m => {
              const mt = markerTypes.find(x => x.type === m.type) || markerTypes[0];
              return (
                <div key={m.id} className="flex items-start gap-3 px-5 py-4">
                  <mt.icon className={`mt-0.5 ${mt.color}`} size={18} />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 text-sm">{m.label}</div>
                    <div className="text-xs text-gray-400">{mt.label}{m.lat ? ` · GPS: ${m.lat}, ${m.lng}` : ""}</div>
                    {m.notes && <div className="text-xs text-gray-500 mt-0.5">{m.notes}</div>}
                  </div>
                  <button onClick={() => remove(m.id)} className="text-gray-300 hover:text-red-400"><Trash2 size={14} /></button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
