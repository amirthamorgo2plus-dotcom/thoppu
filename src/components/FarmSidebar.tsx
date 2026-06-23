"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Map, Users, Wheat, Droplets, AlertTriangle, Link2, ChevronLeft, LogOut, CloudSun, IndianRupee } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "farm-map", label: "Farm Map", icon: Map },
  { key: "workers", label: "Workers & Work", icon: Users },
  { key: "harvest", label: "Harvest & Yield", icon: Wheat },
  { key: "irrigation", label: "Irrigation", icon: Droplets },
  { key: "problems", label: "Problems", icon: AlertTriangle },
  { key: "weather", label: "Weather", icon: CloudSun },
  { key: "finance", label: "Finance", icon: IndianRupee },
  { key: "useful-links", label: "Links", icon: Link2 },
];

export default function FarmSidebar({ farmId }: { farmId: string }) {
  const path = usePathname();
  const router = useRouter();
  const [farmName, setFarmName] = useState("My Farm");

  useEffect(() => {
    supabase.from("farms").select("name").eq("id", farmId).single().then(({ data }) => {
      if (data) setFarmName(data.name);
    });
  }, [farmId]);

  const signOut = async () => { await supabase.auth.signOut(); router.push("/login"); };

  const getHref = (key: string) => key === "useful-links" ? "/useful-links" : `/app/${farmId}/${key}`;

  return (
    <>
      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-green-900 text-white flex-col z-10">
        <div className="flex items-center gap-3 px-4 py-4 border-b border-green-700">
          <Image src="/logo.png" alt="Thoppu" width={40} height={40} className="rounded-lg" />
          <div className="min-w-0">
            <div className="font-bold text-sm leading-tight truncate">{farmName}</div>
            <div className="text-green-400 text-xs">Thoppu Farm Manager</div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ key, label, icon: Icon }) => {
            const href = getHref(key);
            const active = path === href;
            return (
              <Link key={key} href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? "bg-green-700 text-white" : "text-green-200 hover:bg-green-800 hover:text-white"}`}>
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-3 border-t border-green-700 space-y-1">
          <Link href="/farms" className="flex items-center gap-2 px-3 py-2 text-green-300 hover:text-white text-xs rounded-lg hover:bg-green-800">
            <ChevronLeft size={14} /> Switch Farm
          </Link>
          <button onClick={signOut} className="flex items-center gap-2 px-3 py-2 text-green-300 hover:text-white text-xs rounded-lg hover:bg-green-800 w-full">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── MOBILE TOP BAR ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-green-900 text-white flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Thoppu" width={28} height={28} className="rounded-md" />
          <span className="font-bold text-sm truncate max-w-[160px]">{farmName}</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/farms" className="text-green-300 hover:text-white">
            <ChevronLeft size={18} />
          </Link>
          <button onClick={signOut} className="text-green-300 hover:text-white">
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-green-900 border-t border-green-700 flex">
        {navItems.map(({ key, label, icon: Icon }) => {
          const href = getHref(key);
          const active = path === href;
          return (
            <Link key={key} href={href}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-center transition-colors ${active ? "text-white bg-green-700" : "text-green-300 hover:text-white"}`}>
              <Icon size={18} />
              <span className="text-[9px] leading-tight">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
