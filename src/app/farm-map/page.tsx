"use client";
import { useState } from "react";
import { MapPin, Droplets, Home, TreePine, Plus } from "lucide-react";

const markerTypes = [
  { type: "block", label: "Block / Partition", icon: TreePine, color: "text-green-600" },
  { type: "borewell", label: "Borewell", icon: Droplets, color: "text-blue-600" },
  { type: "valve", label: "Gate Valve", icon: MapPin, color: "text-orange-500" },
  { type: "house", label: "House / Building", icon: Home, color: "text-purple-600" },
];

const defaultMarkers = [
  { id: 1, type: "house", label: "Farm House", lat: "11.0168", lng: "76.9558", notes: "Main residence" },
  { id: 2, type: "borewell", label: "Borewell #1", lat: "11.0172", lng: "76.9562", notes: "Motor: 5HP, depth 200ft" },
  { id: 3, type: "block", label: "Block A", lat: "11.0175", lng: "76.9570", notes: "350 trees, NE section" },
  { id: 4, type: "valve", label: "Gate Valve 1", lat: "11.0169", lng: "76.9565", notes: "Feeds Block A & B" },
];

export default function FarmMap() {
  const [markers, setMarkers] = useState(defaultMarkers);
  const [form, setForm] = useState({ type: "block", label: "", lat: "", lng: "", notes: "" });
  const [showForm, setShowForm] = useState(false);

  const addMarker = () => {
    if (!form.label) return;
    setMarkers([...markers, { id: Date.now(), ...form }]);
    setForm({ type: "block", label: "", lat: "", lng: "", notes: "" });
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Farm Map</h1>
          <p className="text-gray-500 text-sm mt-1">Mark blocks, borewells, gate valves, and buildings</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800"
        >
          <Plus size={16} /> Add Location
        </button>
      </div>

      {/* Map placeholder — replace with Leaflet once GPS coords are confirmed */}
      <div className="bg-green-50 border-2 border-dashed border-green-200 rounded-xl h-72 flex flex-col items-center justify-center mb-6 text-center px-4">
        <MapPin className="text-green-400 mb-2" size={36} />
        <p className="text-green-700 font-medium">Interactive Map</p>
        <p className="text-green-500 text-sm mt-1">Share the exact GPS location of your farm and we&apos;ll pin everything on a live satellite map.</p>
        <p className="text-green-400 text-xs mt-2">Leaflet + OpenStreetMap · 100% free · No API key needed</p>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-4">Add New Location</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs text-gray-500 mb-1 block">Type</label>
              <select
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              >
                {markerTypes.map(m => <option key={m.type} value={m.type}>{m.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Name / Label</label>
              <input value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} placeholder="e.g. Block A" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Notes</label>
              <input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="e.g. 350 trees, NE corner" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Latitude (GPS)</label>
              <input value={form.lat} onChange={e => setForm({ ...form, lat: e.target.value })} placeholder="11.0168" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Longitude (GPS)</label>
              <input value={form.lng} onChange={e => setForm({ ...form, lng: e.target.value })} placeholder="76.9558" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={addMarker} className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800">Save Location</button>
            <button onClick={() => setShowForm(false)} className="text-gray-500 px-4 py-2 rounded-lg text-sm hover:bg-gray-100">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-700">All Locations ({markers.length})</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {markers.map(m => {
            const mt = markerTypes.find(x => x.type === m.type)!;
            return (
              <div key={m.id} className="flex items-start gap-3 px-5 py-4">
                <mt.icon className={`mt-0.5 ${mt.color}`} size={18} />
                <div className="flex-1">
                  <div className="font-medium text-gray-800 text-sm">{m.label}</div>
                  <div className="text-xs text-gray-400">{mt.label} · GPS: {m.lat}, {m.lng}</div>
                  {m.notes && <div className="text-xs text-gray-500 mt-0.5">{m.notes}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
