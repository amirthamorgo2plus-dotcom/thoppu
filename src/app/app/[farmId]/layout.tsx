import FarmSidebar from "@/components/FarmSidebar";

export default function FarmLayout({ children, params }: { children: React.ReactNode; params: { farmId: string } }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <FarmSidebar farmId={params.farmId} />
      <main className="flex-1 ml-64 p-6 overflow-auto">{children}</main>
    </div>
  );
}
