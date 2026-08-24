import { NextResponse } from "next/server";

type Consulta = {
  id: string;
  name: string;
  email: string;
  date?: string;
  notes?: string;
  price: number;
};

const MOCK: Consulta[] = [];
const CONSULTA_PRICE = 200;

function isValidConsulta(body: unknown): body is Pick<Consulta, "name" | "email" | "date" | "notes"> {
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

export async function GET() {
  return NextResponse.json({ data: MOCK, price: CONSULTA_PRICE });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!isValidConsulta(body)) {
      return NextResponse.json({ error: "Nome, e-mail e data válida são obrigatórios." }, { status: 422 });
    }

    const consulta: Consulta = {
      id: String(Date.now()),
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      date: body.date,
      notes: body.notes?.trim(),
      price: CONSULTA_PRICE,
    };
    // Temporary in-memory persistence until a database is configured.
    MOCK.push(consulta);

    return NextResponse.json({ ok: true, id: consulta.id, message: "Agendamento recebido." }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }
}
