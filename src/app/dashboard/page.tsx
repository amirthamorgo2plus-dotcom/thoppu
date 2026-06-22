import { TreePine, Users, Wheat, Droplets, AlertTriangle, Activity } from "lucide-react";

const stats = [
  { label: "Total Trees", value: "—", sub: "Update in Farm Setup", icon: TreePine, color: "bg-green-100 text-green-700" },
  { label: "Active Workers", value: "—", sub: "Add in Workers", icon: Users, color: "bg-blue-100 text-blue-700" },
  { label: "Last Harvest", value: "—", sub: "Log in Harvest", icon: Wheat, color: "bg-yellow-100 text-yellow-700" },
  { label: "Open Problems", value: "0", sub: "No issues reported", icon: AlertTriangle, color: "bg-red-100 text-red-700" },
  { label: "Irrigation Zones", value: "—", sub: "Set up gate valves", icon: Droplets, color: "bg-cyan-100 text-cyan-700" },
  { label: "Farm Status", value: "Active", sub: "All systems normal", icon: Activity, color: "bg-purple-100 text-purple-700" },
];

export default function Dashboard() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back — here&apos;s your farm at a glance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-start gap-4">
            <div className={`rounded-lg p-2.5 ${color}`}>
              <Icon size={20} />
            </div>
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
              { label: "📍 Set up farm map & blocks", href: "/farm-map" },
              { label: "👷 Add workers & assign today's work", href: "/workers" },
              { label: "🌰 Log harvest", href: "/harvest" },
              { label: "💧 Update irrigation schedule", href: "/irrigation" },
              { label: "🐛 Report a problem", href: "/problems" },
            ].map(({ label, href }) => (
              <a key={href} href={href} className="block text-sm text-green-700 hover:text-green-900 hover:underline py-1">
                {label}
              </a>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-700 mb-3">Farm Info</h2>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-50">
              {[
                ["Farm Name", "Kallapuram Thetham"],
                ["Location", "Tamil Nadu"],
                ["Area", "100+ acres"],
                ["Primary Crop", "Coconut"],
                ["Owner", "—"],
                ["Manager", "—"],
              ].map(([k, v]) => (
                <tr key={k}>
                  <td className="py-1.5 text-gray-500 w-1/2">{k}</td>
                  <td className="py-1.5 text-gray-800 font-medium">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
