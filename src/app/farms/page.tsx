"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, TreePine, MapPin, LogOut } from "lucide-react";

type Farm = { id: string; name: string; location: string; area_acres: string; primary_crop: string };

export default function Farms() {
  const router = useRouter();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", location: "", area_acres: "", primary_crop: "Coconut" });
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push("/login"); return; }
      if (data.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) { router.push("/admin"); return; }
      setUserName(data.user.user_metadata?.name || data.user.email || "");
      fetchFarms();
    });
  }, []);

  const fetchFarms = async () => {
    const { data } = await supabase.from("farms").select("*").order("created_at");
    setFarms(data || []);
    setLoading(false);
  };

  const createFarm = async () => {
    if (!form.name) return;
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase.from("farms").insert({ ...form, owner_id: user!.id }).select().single();
    if (!error && data) { router.push(`/app/${data.id}/dashboard`); }
  };

  const signOut = async () => { await supabase.auth.signOut(); router.push("/login"); };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Thoppu" width={40} height={40} />
            <div>
              <div className="font-bold text-green-900">Thoppu</div>
              <div className="text-xs text-gray-500">Welcome, {userName}</div>
            </div>
          </div>
          <button onClick={signOut} className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 text-sm">
            <LogOut size={15} /> Sign out
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-800">My Farms</h1>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800">
            <Plus size={15} /> Add Farm
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-4">
            <h2 className="font-semibold text-gray-700 mb-4">New Farm</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs text-gray-500 mb-1 block">Farm Name *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Kallapuram Thetham"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Location</label>
                <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. Pollachi, Tamil Nadu"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Area (acres)</label>
                <input value={form.area_acres} onChange={e => setForm({ ...form, area_acres: e.target.value })}
                  placeholder="e.g. 100"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-gray-500 mb-1 block">Primary Crop</label>
                <input value={form.primary_crop} onChange={e => setForm({ ...form, primary_crop: e.target.value })}
                  placeholder="Coconut"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={createFarm} className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800">Create Farm</button>
              <button onClick={() => setShowForm(false)} className="text-gray-500 px-4 py-2 rounded-lg text-sm hover:bg-gray-100">Cancel</button>
            </div>
          </div>
        )}

        {farms.length === 0 && !showForm ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <TreePine className="text-green-300 mx-auto mb-3" size={40} />
            <p className="text-gray-500 font-medium">No farms yet</p>
            <p className="text-gray-400 text-sm mt-1">Click &quot;Add Farm&quot; to create your first farm</p>
          </div>
        ) : (
          <div className="space-y-3">
            {farms.map(farm => (
              <button key={farm.id} onClick={() => router.push(`/app/${farm.id}/dashboard`)}
                className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-left hover:border-green-300 hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-gray-800">{farm.name}</div>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                      <MapPin size={11} /> {farm.location || "Location not set"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-700">{farm.area_acres ? `${farm.area_acres} acres` : "—"}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{farm.primary_crop}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
