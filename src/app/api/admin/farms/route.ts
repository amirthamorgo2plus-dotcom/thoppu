import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function GET() {
  const { data: farms } = await admin.from("farms").select("*").order("created_at", { ascending: false });
  const { data: { users } } = await admin.auth.admin.listUsers();

  const enriched = (farms || []).map(f => {
    const owner = users.find(u => u.id === f.owner_id);
    return { ...f, owner_email: owner?.email || "—" };
  });

  const totalUsers = users.length;
  return NextResponse.json({ farms: enriched, totalUsers });
}
