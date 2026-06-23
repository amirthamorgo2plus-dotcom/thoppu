"use client";
import { use, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { TreePine, Users, Wheat, Droplets, AlertTriangle, Activity, CloudSun } from "lucide-react";
import Link from "next/link";

type WeatherDay = { date: string; maxTemp: number; minTemp: number; rain: number; code: number };

function weatherDesc(code: number) {
  if (code === 0) return { emoji: "☀️", label: "Clear" };
  if (code <= 3) return { emoji: "⛅", label: "Cloudy" };
  if (code <= 48) return { emoji: "🌫️", label: "Foggy" };
  if (code <= 67) return { emoji: "🌧️", label: "Rain" };
  if (code <= 82) return { emoji: "🌦️", label: "Showers" };
  if (code <= 99) return { emoji: "⛈️", label: "Storm" };
  return { emoji: "🌡️", label: "—" };
}

export default function Dashboard({ params }: { params: Promise<{ farmId: string }> }) {
  const { farmId } = use(params);
  const [farm, setFarm] = useState<any>(null);
  const [counts, setCounts] = useState({ workers: 0, harvests: 0, problems: 0, valves: 0 });
  const [weather, setWeather] = useState<{ current: any; forecast: WeatherDay[] } | null>(null);
  const [lat, setLat] = useState(10.659);
  const [lng, setLng] = useState(76.9558);

  useEffect(() => {
    supabase.from("farms").select("*").eq("id", farmId).single().then(({ data }) => setFarm(data));
    Promise.all([
      supabase.from("workers").select("id", { count: "exact" }).eq("farm_id", farmId),
      supabase.from("harvest_logs").select("id", { count: "exact" }).eq("farm_id", farmId),
      supabase.from("problems").select("id", { count: "exact" }).eq("farm_id", farmId).eq("status", "open"),
      supabase.from("irrigation_valves").select("id", { count: "exact" }).eq("farm_id", farmId).eq("status", "open"),
    ]).then(([w, h, p, v]) => setCounts({ workers: w.count || 0, harvests: h.count || 0, problems: p.count || 0, valves: v.count || 0 }));
    supabase.from("farm_locations").select("lat,lng").eq("farm_id", farmId).not("lat", "is", null).limit(1).then(({ data }) => {
      if (data?.[0]?.lat) { setLat(parseFloat(data[0].lat)); setLng(parseFloat(data[0].lng)); }
    });
  }, [farmId]);

  useEffect(() => {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,rain,weather_code&daily=temperature_2m_max,temperature_2m_min,rain_sum,weather_code&timezone=Asia%2FKolkata&forecast_days=5`)
      .then(r => r.json()).then(d => {
        setWeather({
          current: { temp: Math.round(d.current.temperature_2m), humidity: d.current.relative_humidity_2m, rain: d.current.rain, code: d.current.weather_code },
          forecast: d.daily.time.map((date: string, i: number) => ({
            date, maxTemp: Math.round(d.daily.temperature_2m_max[i]), minTemp: Math.round(d.daily.temperature_2m_min[i]),
            rain: Math.round(d.daily.rain_sum[i] * 10) / 10, code: d.daily.weather_code[i],
          })),
        });
      }).catch(() => {});
  }, [lat, lng]);

  const stats = [
    { label: "Workers", value: counts.workers || "—", sub: "Registered workers", icon: Users, color: "bg-blue-100 text-blue-700" },
    { label: "Harvest Sessions", value: counts.harvests || "—", sub: "Total logged", icon: Wheat, color: "bg-yellow-100 text-yellow-700" },
    { label: "Open Problems", value: counts.problems, sub: counts.problems === 0 ? "All clear" : "Needs attention", icon: AlertTriangle, color: "bg-red-100 text-red-700" },
    { label: "Valves Open", value: counts.valves, sub: "Currently irrigating", icon: Droplets, color: "bg-cyan-100 text-cyan-700" },
    { label: "Primary Crop", value: farm?.primary_crop || "Coconut", sub: farm?.area_acres ? `${farm.area_acres} acres` : "Area not set", icon: TreePine, color: "bg-green-100 text-green-700" },
    { label: "Farm Status", value: "Active", sub: "All systems normal", icon: Activity, color: "bg-purple-100 text-purple-700" },
  ];

  const cw = weather?.current ? weatherDesc(weather.current.code) : null;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{farm?.name || "Dashboard"}</h1>
        <p className="text-gray-500 text-sm mt-1">{farm?.location || "Farm overview"}</p>
      </div>

      {/* Weather strip */}
      {weather && cw && (
        <Link href={`/app/${farmId}/weather`} className="block bg-green-900 text-white rounded-2xl p-4 mb-6 hover:bg-green-800 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{cw.emoji}</span>
              <div>
                <div className="text-3xl font-bold">{weather.current.temp}°C <span className="text-lg font-normal text-green-300">{cw.label}</span></div>
                <div className="text-green-400 text-xs mt-0.5">💧 {weather.current.humidity}% humidity · 🌧️ {weather.current.rain}mm rain · Tap for full forecast</div>
              </div>
            </div>
            {/* 5-day mini forecast */}
            <div className="hidden sm:flex gap-3">
              {weather.forecast.slice(0, 5).map((day, i) => {
                const wd = weatherDesc(day.code);
                const d = new Date(day.date);
                return (
                  <div key={day.date} className="text-center">
                    <div className="text-xs text-green-400">{i === 0 ? "Today" : d.toLocaleDateString("en-IN", { weekday: "short" })}</div>
                    <div className="text-xl my-0.5">{wd.emoji}</div>
                    <div className="text-xs font-medium">{day.maxTemp}°</div>
                    {day.rain > 0 && <div className="text-xs text-blue-300">{day.rain}mm</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </Link>
      )}

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
              { label: "💰 Log expense or income", href: `/app/${farmId}/finance` },
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
