"use client";
import { useState } from "react";
import { Droplets, Plus, Zap } from "lucide-react";

const defaultValves = [
  { id: 1, name: "Gate Valve 1", block: "Block A", status: "open", lastRun: "2026-06-20", duration: "3 hrs" },
  { id: 2, name: "Gate Valve 2", block: "Block B", status: "closed", lastRun: "2026-06-18", duration: "2.5 hrs" },
  { id: 3, name: "Gate Valve 3", block: "Block C", status: "closed", lastRun: "2026-06-15", duration: "3 hrs" },
];

const borewells = [
  { id: 1, name: "Borewell #1", depth: "200 ft", motor: "5 HP", feeds: "Block A, B", lastService: "2026-04-10" },
  { id: 2, name: "Borewell #2", depth: "180 ft", motor: "3 HP", feeds: "Block C", lastService: "2026-03-22" },
];

export default function Irrigation() {
  const [valves, setValves] = useState(defaultValves);

  const toggle = (id: number) => {
    setValves(valves.map(v => v.id === id ? { ...v, status: v.status === "open" ? "closed" : "open" } : v));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Irrigation</h1>
        <p className="text-gray-500 text-sm mt-1">Gate valve status and borewell details</p>
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="px-5 py-3 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700">Gate Valves</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {valves.map(v => (
            <div key={v.id} className="flex items-center gap-4 px-5 py-4">
              <Droplets className={v.status === "open" ? "text-blue-500" : "text-gray-300"} size={20} />
              <div className="flex-1">
                <div className="font-medium text-gray-800 text-sm">{v.name} <span className="text-gray-400 font-normal">· {v.block}</span></div>
                <div className="text-xs text-gray-400 mt-0.5">Last run: {v.lastRun} · {v.duration}</div>
              </div>
              <button
                onClick={() => toggle(v.id)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                  v.status === "open"
                    ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {v.status === "open" ? "● Open" : "○ Closed"}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
          <Zap size={16} className="text-yellow-500" />
          <h2 className="font-semibold text-gray-700">Borewells</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {borewells.map(b => (
            <div key={b.id} className="px-5 py-4">
              <div className="font-medium text-gray-800 text-sm">{b.name}</div>
              <div className="grid grid-cols-2 gap-x-6 mt-2 text-xs text-gray-500">
                <span>Depth: <span className="text-gray-700">{b.depth}</span></span>
                <span>Motor: <span className="text-gray-700">{b.motor}</span></span>
                <span>Feeds: <span className="text-gray-700">{b.feeds}</span></span>
                <span>Last service: <span className="text-gray-700">{b.lastService}</span></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
