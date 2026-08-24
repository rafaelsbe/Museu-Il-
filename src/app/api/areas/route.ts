import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("areas")
    .select("slug, title, description, color_token")
    .eq("is_published", true)
    .order("sort_order");

  if (error) {
    console.error("Supabase areas query failed", error);
    return NextResponse.json({ error: "Não foi possível carregar as áreas." }, { status: 500 });
  }

  return NextResponse.json(data.map((area) => ({ ...area, colorToken: area.color_token })));
}
