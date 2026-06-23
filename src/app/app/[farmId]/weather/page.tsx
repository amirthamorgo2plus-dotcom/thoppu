"use client";
import { use, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Cloud, Droplets, Wind, Thermometer, AlertTriangle, CheckCircle, Sun, CloudRain } from "lucide-react";

type WeatherDay = {
  date: string;
  maxTemp: number;
  minTemp: number;
  rain: number;
  humidity: number;
  windSpeed: number;
  code: number;
};

type Current = {
  temp: number;
  humidity: number;
  rain: number;
  windSpeed: number;
  code: number;
};

function weatherDesc(code: number) {
  if (code === 0) return { label: "Clear Sky", emoji: "☀️" };
  if (code <= 3) return { label: "Partly Cloudy", emoji: "⛅" };
  if (code <= 48) return { label: "Foggy", emoji: "🌫️" };
  if (code <= 67) return { label: "Rain", emoji: "🌧️" };
  if (code <= 77) return { label: "Snow", emoji: "❄️" };
  if (code <= 82) return { label: "Rain Showers", emoji: "🌦️" };
  if (code <= 99) return { label: "Thunderstorm", emoji: "⛈️" };
  return { label: "Unknown", emoji: "🌡️" };
}

function getMoonPhase() {
  const now = new Date();
  const known = new Date(2000, 0, 6);
  const diff = (now.getTime() - known.getTime()) / (1000 * 60 * 60 * 24);
  const cycle = 29.53;
  const phase = ((diff % cycle) + cycle) % cycle;
  if (phase < 1.85) return { name: "New Moon", emoji: "🌑" };
  if (phase < 7.38) return { name: "Waxing Crescent", emoji: "🌒" };
  if (phase < 9.22) return { name: "First Quarter", emoji: "🌓" };
  if (phase < 14.77) return { name: "Waxing Gibbous", emoji: "🌔" };
  if (phase < 16.61) return { name: "Full Moon", emoji: "🌕" };
  if (phase < 22.15) return { name: "Waning Gibbous", emoji: "🌖" };
  if (phase < 23.99) return { name: "Last Quarter", emoji: "🌗" };
  return { name: "Waning Crescent", emoji: "🌘" };
}

function getAlerts(forecast: WeatherDay[], current: Current | null) {
  const alerts: { type: "warning" | "ok" | "info"; message: string }[] = [];
  if (!current || forecast.length === 0) return alerts;

  const rainNext3 = forecast.slice(0, 3).some(d => d.rain > 5);
  const dryDays = forecast.slice(0, 7).filter(d => d.rain < 1).length;
  const highHumidity = current.humidity > 80;
  const highTemp = current.temp > 36;

  if (rainNext3) alerts.push({ type: "info", message: "🌧️ Rain expected in next 3 days — delay fertiliser and pesticide spray" });
  if (dryDays >= 5) alerts.push({ type: "warning", message: "🏜️ Dry spell ahead — schedule irrigation for Block A & B" });
  if (highHumidity) alerts.push({ type: "warning", message: "💧 High humidity (>" + current.humidity + "%) — watch for fungal disease and rhinoceros beetle activity" });
  if (highTemp) alerts.push({ type: "warning", message: "🌡️ Heat stress risk — ensure borewells are running and trees are irrigated" });
  if (!rainNext3 && dryDays < 5 && !highHumidity) alerts.push({ type: "ok", message: "✅ Good conditions for harvesting and field work this week" });
  if (forecast[0]?.rain > 10) alerts.push({ type: "warning", message: "⛈️ Heavy rain today — avoid climbing operations, check drainage" });

  return alerts;
}

export default function WeatherPage({ params }: { params: Promise<{ farmId: string }> }) {
  const { farmId } = use(params);
  const [current, setCurrent] = useState<Current | null>(null);
  const [forecast, setForecast] = useState<WeatherDay[]>([]);
  const [location, setLocation] = useState("Pollachi, Tamil Nadu");
  const [lat, setLat] = useState(10.659); // Default Pollachi
  const [lng, setLng] = useState(76.9558);
  const [loading, setLoading] = useState(true);
  const moon = getMoonPhase();

  useEffect(() => {
    // Get farm location from saved pins
    supabase.from("farm_locations").select("lat,lng,notes").eq("farm_id", farmId).not("lat", "is", null).limit(1).then(({ data }) => {
      if (data && data.length > 0 && data[0].lat && data[0].lng) {
        const lt = parseFloat(data[0].lat);
        const lg = parseFloat(data[0].lng);
        if (!isNaN(lt) && !isNaN(lg)) { setLat(lt); setLng(lg); }
      }
    });
    supabase.from("farms").select("location").eq("id", farmId).single().then(({ data }) => {
      if (data?.location) setLocation(data.location);
    });
  }, [farmId]);

  useEffect(() => {
    setLoading(true);
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,rain,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,rain_sum,wind_speed_10m_max,relative_humidity_2m_max,weather_code&timezone=Asia%2FKolkata&forecast_days=7`)
      .then(r => r.json())
      .then(d => {
        setCurrent({
          temp: Math.round(d.current.temperature_2m),
          humidity: d.current.relative_humidity_2m,
          rain: d.current.rain,
          windSpeed: Math.round(d.current.wind_speed_10m),
          code: d.current.weather_code,
        });
        setForecast(d.daily.time.map((date: string, i: number) => ({
          date,
          maxTemp: Math.round(d.daily.temperature_2m_max[i]),
          minTemp: Math.round(d.daily.temperature_2m_min[i]),
          rain: Math.round(d.daily.rain_sum[i] * 10) / 10,
          humidity: d.daily.relative_humidity_2m_max[i],
          windSpeed: Math.round(d.daily.wind_speed_10m_max[i]),
          code: d.daily.weather_code[i],
        })));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [lat, lng]);

  const alerts = getAlerts(forecast, current);
  const w = current ? weatherDesc(current.code) : null;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Weather & Farm Alerts</h1>
        <p className="text-gray-500 text-sm mt-1">📍 {location} · Open-Meteo live data</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading weather...</div>
      ) : (
        <>
          {/* Current weather */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="col-span-2 bg-green-900 text-white rounded-2xl p-6 flex items-center gap-5">
              <div className="text-6xl">{w?.emoji}</div>
              <div>
                <div className="text-5xl font-bold">{current?.temp}°C</div>
                <div className="text-green-300 mt-1">{w?.label}</div>
                <div className="text-green-400 text-sm mt-0.5">{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</div>
              </div>
            </div>
            {[
              { icon: Droplets, label: "Humidity", value: `${current?.humidity}%`, color: "text-blue-500" },
              { icon: Wind, label: "Wind", value: `${current?.windSpeed} km/h`, color: "text-gray-500" },
              { icon: CloudRain, label: "Rain Today", value: `${current?.rain} mm`, color: "text-blue-600" },
              { icon: Sun, label: "Moon Phase", value: moon.emoji, sub: moon.name, color: "text-yellow-500" },
            ].map(({ icon: Icon, label, value, sub, color }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <Icon className={`${color} mb-2`} size={20} />
                <div className="text-2xl font-bold text-gray-800">{value}</div>
                {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
                <div className="text-sm text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>

          {/* Farm Alerts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="text-orange-500" size={18} />
              <h2 className="font-semibold text-gray-700">Farm Alerts & Recommendations</h2>
            </div>
            <div className="space-y-3">
              {alerts.map((a, i) => (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-lg text-sm ${
                  a.type === "warning" ? "bg-orange-50 text-orange-800" :
                  a.type === "ok" ? "bg-green-50 text-green-800" : "bg-blue-50 text-blue-800"
                }`}>
                  {a.type === "ok" ? <CheckCircle size={16} className="mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="mt-0.5 shrink-0" />}
                  {a.message}
                </div>
              ))}
            </div>
          </div>

          {/* 7-day forecast */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100">
              <h2 className="font-semibold text-gray-700">7-Day Forecast</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {forecast.map((day, i) => {
                const wd = weatherDesc(day.code);
                const date = new Date(day.date);
                return (
                  <div key={day.date} className="flex items-center gap-4 px-5 py-3">
                    <div className="w-24 text-sm text-gray-500">
                      {i === 0 ? "Today" : i === 1 ? "Tomorrow" : date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric" })}
                    </div>
                    <div className="text-2xl">{wd.emoji}</div>
                    <div className="flex-1 text-sm text-gray-600">{wd.label}</div>
                    <div className="text-xs text-blue-500 w-16 text-right">{day.rain > 0 ? `${day.rain}mm` : "—"}</div>
                    <div className="text-xs text-gray-400 w-20 text-right">{day.humidity}% hum</div>
                    <div className="text-sm font-medium text-gray-800 w-20 text-right">{day.minTemp}° – {day.maxTemp}°</div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
