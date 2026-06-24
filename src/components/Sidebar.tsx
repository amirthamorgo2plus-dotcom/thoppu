"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Map, Users, Wheat, Droplets, AlertTriangle, Link2
} from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/farm-map", label: "Farm Map", icon: Map },
  { href: "/workers", label: "Workers & Work", icon: Users },
  { href: "/harvest", label: "Harvest & Yield", icon: Wheat },
  { href: "/irrigation", label: "Irrigation", icon: Droplets },
  { href: "/problems", label: "Problems", icon: AlertTriangle },
  { href: "/useful-links", label: "Useful Links", icon: Link2 },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-green-900 text-white flex flex-col z-10">
      <div className="flex items-center gap-3 px-4 py-4 border-b border-green-700">
        <Image src="/logo.png" alt="Thoppu" width={44} height={44} className="rounded-lg" />
        <div>
          <div className="font-bold text-lg leading-tight">Thoppu</div>
          <div className="text-green-400 text-xs">Farm Manager</div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              path === href
                ? "bg-green-700 text-white"
                : "text-green-200 hover:bg-green-800 hover:text-white"
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>
      <div className="px-6 py-4 border-t border-green-700 text-green-400 text-xs">
        Kallapuram Thottam · 100+ acres
      </div>
    </aside>
  );
}
