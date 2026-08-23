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

export async function GET() {
  return NextResponse.json({ data: MOCK, price: 200 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const consulta: Consulta = {
      id: String(Date.now()),
      name: body.name,
      email: body.email,
      date: body.date,
      notes: body.notes,
      price: body.price ?? 200,
    };
    // Placeholder: here you would persist to a database
    MOCK.push(consulta);

    return NextResponse.json({ ok: true, id: consulta.id, message: "Agendamento recebido." }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }
}
