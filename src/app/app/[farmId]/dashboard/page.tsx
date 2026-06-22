"use client";
import { use, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { TreePine, Users, Wheat, Droplets, AlertTriangle, Activity } from "lucide-react";
import Link from "next/link";

export default function Dashboard({ params }: { params: Promise<{ farmId: string }> }) {
  const { farmId } = use(params);
  const [farm, setFarm] = useState<any>(null);
  const [counts, setCounts] = useState({ workers: 0, harvests: 0, problems: 0, valves: 0 });

  useEffect(() => {
    supabase.from("farms").select("*").eq("id", farmId).single().then(({ data }) => setFarm(data));
    Promise.all([
      supabase.from("workers").select("id", { count: "exact" }).eq("farm_id", farmId),
      supabase.from("harvest_logs").select("id", { count: "exact" }).eq("farm_id", farmId),
      supabase.from("problems").select("id", { count: "exact" }).eq("farm_id", farmId).eq("status", "open"),
      supabase.from("irrigation_valves").select("id", { count: "exact" }).eq("farm_id", farmId).eq("status", "open"),
    ]).then(([w, h, p, v]) => setCounts({ workers: w.count || 0, harvests: h.count || 0, problems: p.count || 0, valves: v.count || 0 }));
  }, [farmId]);

  const stats = [
    { label: "Workers", value: counts.workers || "—", sub: "Registered workers", icon: Users, color: "bg-blue-100 text-blue-700" },
    { label: "Harvest Sessions", value: counts.harvests || "—", sub: "Total logged", icon: Wheat, color: "bg-yellow-100 text-yellow-700" },
    { label: "Open Problems", value: counts.problems, sub: counts.problems === 0 ? "All clear" : "Needs attention", icon: AlertTriangle, color: "bg-red-100 text-red-700" },
    { label: "Valves Open", value: counts.valves, sub: "Currently irrigating", icon: Droplets, color: "bg-cyan-100 text-cyan-700" },
    { label: "Primary Crop", value: farm?.primary_crop || "Coconut", sub: farm?.area_acres ? `${farm.area_acres} acres` : "Area not set", icon: TreePine, color: "bg-green-100 text-green-700" },
    { label: "Farm Status", value: "Active", sub: "All systems normal", icon: Activity, color: "bg-purple-100 text-purple-700" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{farm?.name || "Dashboard"}</h1>
        <p className="text-gray-500 text-sm mt-1">{farm?.location || "Farm overview"}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-start gap-4">
            <div className={`rounded-lg p-2.5 ${color}`}><Icon size={20} /></div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{value}</div>
              <div className="text-sm font-medium text-gray-700">{label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-700 mb-3">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: "📍 Set up farm map & blocks", href: `/app/${farmId}/farm-map` },
              { label: "👷 Add workers & assign work", href: `/app/${farmId}/workers` },
              { label: "🌰 Log harvest", href: `/app/${farmId}/harvest` },
              { label: "💧 Update irrigation", href: `/app/${farmId}/irrigation` },
              { label: "🐛 Report a problem", href: `/app/${farmId}/problems` },
            ].map(({ label, href }) => (
              <Link key={href} href={href} className="block text-sm text-green-700 hover:text-green-900 hover:underline py-1">{label}</Link>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-700 mb-3">Farm Info</h2>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-50">
              {[
                ["Farm Name", farm?.name],
                ["Location", farm?.location],
                ["Area", farm?.area_acres ? `${farm.area_acres} acres` : "—"],
                ["Primary Crop", farm?.primary_crop],
                ["Manager", farm?.manager_name || "—"],
              ].map(([k, v]) => (
                <tr key={k}>
                  <td className="py-1.5 text-gray-500 w-1/2">{k}</td>
                  <td className="py-1.5 text-gray-800 font-medium">{v || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
