import FarmSidebar from "@/components/FarmSidebar";
import { use } from "react";

export default function FarmLayout({ children, params }: { children: React.ReactNode; params: Promise<{ farmId: string }> }) {
  const { farmId } = use(params);
  return (
    <div className="flex min-h-screen bg-gray-50">
      <FarmSidebar farmId={farmId} />
      <main className="flex-1 md:ml-64 p-4 md:p-6 pt-16 md:pt-6 pb-24 md:pb-6 overflow-auto">{children}</main>
    </div>
  );
}
