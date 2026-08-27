import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

type Consulta = {
  id: string;
  name: string;
  email: string;
  date?: string;
  notes?: string;
  price: number;
};

const CONSULTA_PRICE = 200;
const CONSULTA_NOTIFICATION_EMAIL = "rafelbezerrahdev@gmail.com";

function isValidConsulta(body: unknown): body is Omit<Pick<Consulta, "name" | "email" | "date" | "notes">, "date"> & { date: string } {
  if (!body || typeof body !== "object") return false;
  const candidate = body as Record<string, unknown>;
  return (
    typeof candidate.name === "string" && candidate.name.trim().length >= 2 &&
    typeof candidate.email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate.email) &&
    typeof candidate.date === "string" && isFutureOrToday(candidate.date) &&
    (candidate.notes === undefined || typeof candidate.notes === "string")
  );
}

function isFutureOrToday(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const today = new Date();
  const todayUtc = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day && date >= todayUtc;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);
}

async function sendConsultaNotification(consulta: {
  id: string;
  name: string;
  email: string;
  date: string;
  notes?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    throw new Error("Resend email configuration is missing");
  }

  const safeName = escapeHtml(consulta.name);
  const safeEmail = escapeHtml(consulta.email);
  const safeDate = escapeHtml(consulta.date);
  const safeNotes = escapeHtml(consulta.notes || "Nenhuma observação informada.");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [CONSULTA_NOTIFICATION_EMAIL],
      subject: `[Museu] Nova consulta de búzios - ${consulta.name}`,
      text: [
        "Nova solicitação de consulta de búzios",
        `Nome: ${consulta.name}`,
        `E-mail: ${consulta.email}`,
        `Data desejada: ${consulta.date}`,
        `Valor: R$ ${CONSULTA_PRICE},00`,
        `Observações: ${consulta.notes || "Nenhuma observação informada."}`,
        `ID da solicitação: ${consulta.id}`,
      ].join("\n"),
      html: `<h2>Nova solicitação de consulta de búzios</h2><p><strong>Nome:</strong> ${safeName}</p><p><strong>E-mail:</strong> ${safeEmail}</p><p><strong>Data desejada:</strong> ${safeDate}</p><p><strong>Valor:</strong> R$ ${CONSULTA_PRICE},00</p><p><strong>Observações:</strong><br />${safeNotes}</p><p><strong>ID da solicitação:</strong> ${escapeHtml(consulta.id)}</p>`,
    }),
  });

  if (!response.ok) {
    console.error("Resend consultation notification failed", await response.text());
    throw new Error("Consultation notification failed");
  }
}

export async function GET() {
  return NextResponse.json({ price: CONSULTA_PRICE });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!isValidConsulta(body)) {
      return NextResponse.json({ error: "Nome, e-mail e data válida são obrigatórios." }, { status: 422 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("consultation_requests")
      .insert({
        name: body.name.trim(),
        email: body.email.trim().toLowerCase(),
        requested_date: body.date,
        notes: body.notes?.trim() || null,
        price_cents: CONSULTA_PRICE * 100,
      })
      .select("id")
      .single();

    if (error || !data) {
      console.error("Supabase consultation insert failed", error);
      return NextResponse.json({ error: "Não foi possível registrar a solicitação." }, { status: 500 });
    }

    try {
      await sendConsultaNotification({
        id: data.id,
        name: body.name.trim(),
        email: body.email.trim().toLowerCase(),
        date: body.date,
        notes: body.notes?.trim() || undefined,
      });
    } catch (notificationError) {
      console.error("Consultation notification error", notificationError);
      return NextResponse.json({ error: "A solicitação foi registrada, mas não foi possível enviar a notificação por e-mail." }, { status: 502 });
    }

    return NextResponse.json({ ok: true, id: data.id, message: "Agendamento recebido." }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }
}
