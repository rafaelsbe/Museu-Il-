import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { isValidBrazilianPhone, cleanPhone } from "@/lib/phoneValidator";

type Consulta = {
  id: string;
  name: string;
  email: string;
  phone: string;
  date?: string;
  notes?: string;
  price: number;
};

const CONSULTA_PRICE = 200;
const CONSULTA_SERVICE_SLUG = "consulta-buzios";

function isValidConsulta(
  body: unknown
): body is Pick<Consulta, "name" | "email" | "phone" | "date" | "notes"> {
  if (!body || typeof body !== "object") return false;

  const candidate = body as Record<string, unknown>;

  return (
    typeof candidate.name === "string" &&
    candidate.name.trim().length >= 2 &&
    typeof candidate.email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate.email) &&
    typeof candidate.phone === "string" &&
    isValidBrazilianPhone(candidate.phone) &&
    typeof candidate.date === "string" &&
    isFutureOrToday(candidate.date) &&
    (candidate.notes === undefined || typeof candidate.notes === "string")
  );
}

function isFutureOrToday(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const [year, month, day] = value.split("-").map(Number);

  const date = new Date(Date.UTC(year, month - 1, day));

  const today = new Date();

  const todayUtc = new Date(
    Date.UTC(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    )
  );

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day &&
    date >= todayUtc
  );
}

export async function GET() {
  return NextResponse.json({
    price: CONSULTA_PRICE,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!isValidConsulta(body)) {
      return NextResponse.json(
        {
          error:
            "Nome, e-mail, telefone e data válida são obrigatórios.",
        },
        { status: 422 }
      );
    }

    const supabase = await createClient();

    /*
     * ============================================================
     * BUSCAR EVENTO CONSULTA DE BÚZIOS
     * ============================================================
     */

    const { data: eventData, error: eventError } = await supabase
      .from("events")
      .select("id")
      .eq("slug", CONSULTA_SERVICE_SLUG)
      .eq("status", "published")
      .single();

    console.log("EVENT RESULT:", eventData);
    console.log("EVENT ERROR:", eventError);

    /*
     * ============================================================
     * BUSCAR GUIAS DISPONÍVEIS
     * ============================================================
     */

    const { data: guidesData, error: guidesError } = await supabase
      .from("guides")
      .select("*")
      .eq("is_available", true)
      .limit(10);

    console.log("GUIDES RESULT:", guidesData);
    console.log("GUIDES ERROR:", guidesError);

    if (guidesError) {
      console.error(
        "Error while searching for available guides:",
        guidesError
      );

      return NextResponse.json(
        {
          error:
            "Erro ao buscar guias disponíveis.",
        },
        { status: 500 }
      );
    }

    if (!guidesData || guidesData.length === 0) {
      console.error("No available guides found");

      return NextResponse.json(
        {
          error:
            "Não há guias disponíveis no momento.",
        },
        { status: 500 }
      );
    }

    /*
     * ============================================================
     * SELECIONAR GUIA ALEATÓRIO
     * ============================================================
     */

    const randomGuide =
      guidesData[
        Math.floor(Math.random() * guidesData.length)
      ];

    console.log("SELECTED GUIDE:", randomGuide);

    /*
     * ============================================================
     * CRIAR AGENDAMENTO
     * ============================================================
     */

    const consultationData = {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: cleanPhone(body.phone),
      requested_date: body.date,
      notes: body.notes?.trim() || null,
      price_cents: CONSULTA_PRICE * 100,
      event_id: eventData?.id || null,
      guide_id: randomGuide.id,
    };

    console.log(
      "CONSULTATION DATA BEING INSERTED:",
      consultationData
    );

    const { data, error } = await supabase
      .from("consultation_requests")
      .insert(consultationData)
      .select("id")
      .single();

    if (error || !data) {
      console.error(
        "Supabase consultation insert failed:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Não foi possível registrar a solicitação.",
        },
        { status: 500 }
      );
    }

    console.log(
      "CONSULTATION CREATED SUCCESSFULLY:",
      data
    );

    return NextResponse.json(
      {
        ok: true,
        id: data.id,
        message: "Agendamento recebido.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CONSULTATION API ERROR:", error);

    return NextResponse.json(
      {
        error: "Dados inválidos",
      },
      { status: 400 }
    );
  }
}