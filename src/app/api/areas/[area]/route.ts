import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(_request: Request, { params }: { params: Promise<{ area: string }> }) {
  const { area } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("areas")
    .select("slug, title, description, color_token, media(src:storage_path, alt_text)")
    .eq("slug", area)
    .eq("is_published", true)
    .single();

  if (error?.code === "PGRST116") {
    return NextResponse.json({ error: "Área não encontrada" }, { status: 404 });
  }
  if (error || !data) {
    console.error("Supabase area query failed", error);
    return NextResponse.json({ error: "Não foi possível carregar a área." }, { status: 500 });
  }

  return NextResponse.json({
    slug: data.slug,
    title: data.title,
    description: data.description,
    colorToken: data.color_token,
    images: (data.media || []).map((image) => ({ src: image.src, alt: image.alt_text })),
  });
}
