"use client";
import { use, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import { MapPin, TreePine, Droplets, Home, Plus, Trash2, Pentagon } from "lucide-react";
import type { MarkerData, GeofenceData } from "@/components/FarmMap";

const FarmMapLeaflet = dynamic(() => import("@/components/FarmMap"), { ssr: false, loading: () => (
  <div className="h-[450px] bg-gray-900 rounded-xl flex items-center justify-center text-gray-400 text-sm">Loading satellite map...</div>
)});

const markerTypes = [
  { type: "block", label: "Block / Partition", icon: TreePine, color: "text-green-600" },
  { type: "borewell", label: "Borewell", icon: Droplets, color: "text-blue-600" },
  { type: "valve", label: "Gate Valve", icon: MapPin, color: "text-orange-500" },
  { type: "house", label: "House / Building", icon: Home, color: "text-purple-600" },
];

const fenceColors = ["#16a34a", "#2563eb", "#dc2626", "#d97706", "#7c3aed"];

export default function FarmMapPage({ params }: { params: Promise<{ farmId: string }> }) {
  const { farmId } = use(params);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [geofences, setGeofences] = useState<GeofenceData[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: "block", label: "", lat: "", lng: "", notes: "" });

  // Geofence drawing state
  const [drawing, setDrawing] = useState(false);
  const [drawPoints, setDrawPoints] = useState<[number, number][]>([]);
  const [fenceName, setFenceName] = useState("");
  const [fenceColor, setFenceColor] = useState(fenceColors[0]);
  const [showFenceForm, setShowFenceForm] = useState(false);

  const fetchAll = async () => {
    const [{ data: locs }, { data: fences }] = await Promise.all([
      supabase.from("farm_locations").select("*").eq("farm_id", farmId).order("created_at"),
      supabase.from("geofences").select("*").eq("farm_id", farmId).order("created_at"),
    ]);
    setMarkers(locs || []);
    setGeofences((fences || []).map(f => ({ ...f, points: f.points as [number, number][] })));
  };

  useEffect(() => { fetchAll(); }, [farmId]);

  const addMarker = async () => {
    if (!form.label) return;
    await supabase.from("farm_locations").insert({ farm_id: farmId, ...form });
    setForm({ type: "block", label: "", lat: "", lng: "", notes: "" });
    setShowForm(false);
    fetchAll();
  };

  const removeMarker = async (id: string) => {
    await supabase.from("farm_locations").delete().eq("id", id);
    setMarkers(markers.filter(m => m.id !== id));
  };

  const removeGeofence = async (id: string) => {
    await supabase.from("geofences").delete().eq("id", id);
    setGeofences(geofences.filter(g => g.id !== id));
  };

  const saveGeofence = async () => {
    if (!fenceName || drawPoints.length < 3) return;
    await supabase.from("geofences").insert({ farm_id: farmId, name: fenceName, color: fenceColor, points: drawPoints });
    setDrawPoints([]); setFenceName(""); setDrawing(false); setShowFenceForm(false);
    fetchAll();
  };

  const hasCoords = markers.some(m => m.lat && m.lng) || geofences.length > 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Farm Map</h1>
          <p className="text-gray-500 text-sm mt-1">Satellite view · Mark locations · Draw geofences</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setShowFenceForm(!showFenceForm); setShowForm(false); }}
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            <Pentagon size={15} /> Geofence
          </button>
          <button onClick={() => { setShowForm(!showForm); setShowFenceForm(false); }}
            className="flex items-center gap-2 bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-800">
            <Plus size={15} /> Add Pin
          </button>
        </div>
      </div>

      {/* Geofence toolbar */}
      {showFenceForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
          <h2 className="font-semibold text-blue-800 mb-3">Draw Geofence</h2>
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="text-xs text-blue-600 mb-1 block">Zone Name</label>
              <input value={fenceName} onChange={e => setFenceName(e.target.value)} placeholder="e.g. Block A boundary"
                className="border border-blue-200 rounded-lg px-3 py-2 text-sm w-48" />
            </div>
            <div>
              <label className="text-xs text-blue-600 mb-1 block">Color</label>
              <div className="flex gap-1.5">
                {fenceColors.map(c => (
                  <button key={c} onClick={() => setFenceColor(c)}
                    className={`w-7 h-7 rounded-full border-2 ${fenceColor === c ? "border-gray-800 scale-110" : "border-transparent"} transition-all`}
                    style={{ background: c }} />
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              {!drawing ? (
                <button onClick={() => setDrawing(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                  Start Drawing
                </button>
              ) : (
                <>
                  <button onClick={() => setDrawPoints(prev => prev.slice(0, -1))}
                    className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-300">
                    Undo
                  </button>
                  <button onClick={saveGeofence} disabled={drawPoints.length < 3 || !fenceName}
                    className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800 disabled:opacity-50">
                    Save ({drawPoints.length} pts)
                  </button>
                  <button onClick={() => { setDrawing(false); setDrawPoints([]); }}
                    className="text-gray-500 px-3 py-2 rounded-lg text-sm hover:bg-gray-100">
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
          {drawing && (
            <p className="text-blue-600 text-xs mt-3">📍 Click on the map to add points. Add 3+ points then click Save.</p>
          )}
        </div>
      )}

      {/* Add Pin Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-4">Add Location Pin</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                {markerTypes.map(m => <option key={m.type} value={m.type}>{m.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Name / Label *</label>
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
            <button onClick={addMarker} className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800">Save Pin</button>
            <button onClick={() => setShowForm(false)} className="text-gray-500 px-4 py-2 rounded-lg text-sm hover:bg-gray-100">Cancel</button>
          </div>
        </div>
      )}

      {/* Map */}
      <div className="mb-6 rounded-xl overflow-hidden shadow-sm border border-gray-200">
        {hasCoords || drawing ? (
          <FarmMapLeaflet markers={markers} geofences={geofences} drawing={drawing} drawPoints={drawPoints}
            onAddPoint={(lat, lng) => setDrawPoints(prev => [...prev, [lat, lng]])} />
        ) : (
          <div className="h-[450px] bg-gray-900 rounded-xl flex flex-col items-center justify-center text-center px-6">
            <MapPin className="text-green-400 mb-3" size={36} />
            <p className="text-white font-medium">Add a pin or draw a geofence to see the satellite map</p>
            <p className="text-gray-400 text-sm mt-1">Esri satellite · 100% free</p>
          </div>
        )}
      </div>

      {/* Geofences list */}
      {geofences.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
          <div className="px-5 py-3 border-b border-gray-100">
            <h2 className="font-semibold text-gray-700">Geofences ({geofences.length})</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {geofences.map(g => (
              <div key={g.id} className="flex items-center gap-3 px-5 py-3">
                <div className="w-4 h-4 rounded-full shrink-0" style={{ background: g.color }} />
                <div className="flex-1 text-sm font-medium text-gray-800">{g.name}</div>
                <div className="text-xs text-gray-400">{g.points.length} points</div>
                <button onClick={() => removeGeofence(g.id)} className="text-gray-300 hover:text-red-400 ml-2"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pins list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700">Location Pins ({markers.length})</h2>
        </div>
        {markers.length === 0 ? <div className="p-8 text-center text-gray-400 text-sm">No pins added yet</div> : (
          <div className="divide-y divide-gray-50">
            {markers.map(m => {
              const mt = markerTypes.find(x => x.type === m.type) || markerTypes[0];
              return (
                <div key={m.id} className="flex items-start gap-3 px-5 py-4">
                  <mt.icon className={`mt-0.5 ${mt.color}`} size={18} />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 text-sm">{m.label}</div>
                    <div className="text-xs text-gray-400">{mt.label}{m.lat ? ` · ${m.lat}, ${m.lng}` : ""}</div>
                    {m.notes && <div className="text-xs text-gray-500 mt-0.5">{m.notes}</div>}
                  </div>
                  <button onClick={() => removeMarker(m.id)} className="text-gray-300 hover:text-red-400"><Trash2 size={14} /></button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
