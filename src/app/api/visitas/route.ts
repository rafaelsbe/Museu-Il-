import { NextResponse } from "next/server";
import { cleanPhone, isValidBrazilianPhone } from "@/lib/phoneValidator";
import { createMailTransporter, escapeHtml } from "@/lib/mailer";
import { createClient } from "@/utils/supabase/server";

const VISIT_EVENT_SLUG = "visitas-museu";
const VISIT_TYPES = ["school", "other", "personal_single", "personal_group"] as const;
type VisitType = (typeof VISIT_TYPES)[number];

const VISIT_TYPE_LABELS: Record<VisitType, string> = {
  school: "Escolar",
  other: "Outro",
  personal_single: "Pessoal / Sozinho",
  personal_group: "Pessoal / Em grupo",
};

async function sendVisitNotification(visit: {
  id: string;
  name: string;
  email: string;
  visitType: VisitType;
  date: string;
  time?: string;
  institutionName?: string;
  groupSize?: number | null;
  otherDescription?: string;
  notes?: string;
}) {
  const { gmailUser, transporter } = createMailTransporter();
  const formattedDate = visit.date.split("-").reverse().join("/");
  const formattedTime = visit.time || "A confirmar";
  const details = [
    `<p><strong>Tipo de visita:</strong> ${escapeHtml(VISIT_TYPE_LABELS[visit.visitType])}</p>`,
    `<p><strong>Data:</strong> ${escapeHtml(formattedDate)}</p>`,
    `<p><strong>Horário:</strong> ${escapeHtml(formattedTime)}</p>`,
    visit.institutionName ? `<p><strong>Instituição:</strong> ${escapeHtml(visit.institutionName)}</p>` : "",
    visit.groupSize ? `<p><strong>Quantidade de pessoas:</strong> ${visit.groupSize}</p>` : "",
    visit.otherDescription ? `<p><strong>Descrição:</strong> ${escapeHtml(visit.otherDescription)}</p>` : "",
    visit.notes ? `<p><strong>Observações:</strong> ${escapeHtml(visit.notes).replace(/\n/g, "<br />")}</p>` : "",
  ].join("");

  await Promise.all([
    transporter.sendMail({
      from: `"Museu Notificações" <${gmailUser}>`,
      to: "museuilecontato@gmail.com",
      subject: `[Museu] Nova visita - ${visit.name}`,
      text: `Nova solicitação de visita de ${visit.name}. Data: ${formattedDate}. Horário: ${formattedTime}.`,
      html: `<div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 24px;"><h2>Nova solicitação de visita</h2><p>Confira os detalhes do agendamento:</p><p><strong>Nome:</strong> ${escapeHtml(visit.name)}</p><p><strong>E-mail:</strong> ${escapeHtml(visit.email)}</p>${details}<p style="color: #777; font-size: 12px;">ID da solicitação: ${escapeHtml(visit.id)}</p></div>`,
    }),
    transporter.sendMail({
      from: `"Museu Ilê Asè Alaketù" <${gmailUser}>`,
      to: visit.email,
      subject: "Confirmação de agendamento de visita",
      text: `Olá ${visit.name}, recebemos sua solicitação de visita para ${formattedDate}, às ${formattedTime}.`,
      html: `<div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;"><div style="background-color: #2b2b2b; color: #fff; padding: 24px 20px; text-align: center;"><h1 style="margin: 0; font-size: 22px; font-weight: normal;">ILÈ ASÈ ALAKETÙ</h1><p style="margin: 5px 0 0; font-size: 13px; color: #D77961;">OYA IGBALE / MUSEU VIVO</p></div><div style="padding: 28px 20px;"><h2 style="margin-top: 0; color: #222;">Olá, ${escapeHtml(visit.name)}!</h2><p style="line-height: 1.5; color: #555;">Recebemos sua solicitação de agendamento de visita. Nossa equipe entrará em contato para confirmar a disponibilidade.</p><div style="background-color: #fdfaf9; border-left: 5px solid #B95843; padding: 16px 20px; margin: 22px 0;">${details}</div><p style="font-size: 12px; color: #777;">ID da solicitação: ${escapeHtml(visit.id)}</p></div></div>`,
    }),
  ]);
}

function isValidDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const today = new Date();
  const todayUtc = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day && date >= todayUtc;
}

function isValidTime(value: unknown): value is string | undefined {
  return value === undefined || value === "" || (typeof value === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(value));
}

function isValidEmail(value: unknown): value is string {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const phone = typeof body.phone === "string" ? body.phone : "";
    const visitType = body.visit_type;
    const otherDescription = typeof body.other_description === "string" ? body.other_description.trim() : "";
    const institutionName = typeof body.institution_name === "string" ? body.institution_name.trim() : "";
    const notes = typeof body.notes === "string" ? body.notes.trim() : "";
    const groupSize = body.group_size === "" || body.group_size === undefined ? null : Number(body.group_size);

    if (
      name.length < 2 || name.length > 120 || !isValidEmail(email) || !isValidBrazilianPhone(phone) ||
      typeof visitType !== "string" || !VISIT_TYPES.includes(visitType as VisitType) ||
      !isValidDate(body.requested_date) || !isValidTime(body.requested_time) || notes.length > 3000 ||
      (visitType === "other" && (otherDescription.length < 1 || otherDescription.length > 1000)) ||
      (visitType !== "other" && otherDescription.length > 0) ||
      (visitType === "school" && (institutionName.length < 1 || institutionName.length > 200)) ||
      (visitType !== "school" && institutionName.length > 0) ||
      (visitType === "personal_group" && (typeof groupSize !== "number" || !Number.isInteger(groupSize) || groupSize < 2 || groupSize > 1000)) ||
      (visitType !== "personal_group" && groupSize !== null)
    ) {
      return NextResponse.json({ error: "Confira os dados obrigatórios do agendamento." }, { status: 422 });
    }

    const supabase = await createClient();
    const { data: event, error: eventError } = await supabase.from("events").select("id").eq("slug", VISIT_EVENT_SLUG).eq("status", "published").single();
    if (eventError || !event) {
      console.error("Visit event lookup failed", eventError);
      return NextResponse.json({ error: "O agendamento de visitas está temporariamente indisponível." }, { status: 503 });
    }

    const { data: guides, error: guidesError } = await supabase.from("guides").select("id").eq("is_available", true).limit(10);
    if (guidesError || !guides?.length) {
      console.error("Available guide lookup failed", guidesError);
      return NextResponse.json({ error: "Não há guias disponíveis no momento." }, { status: 503 });
    }

    const guide = guides[Math.floor(Math.random() * guides.length)];
    const visitId = crypto.randomUUID();
    const { error } = await supabase.from("visits").insert({
      id: visitId, name, email, phone: cleanPhone(phone), visit_type: visitType,
      other_description: visitType === "other" ? otherDescription : null,
      institution_name: visitType === "school" ? institutionName : null,
      group_size: visitType === "personal_group" ? groupSize : null,
      requested_date: body.requested_date, requested_time: body.requested_time || null,
      notes: notes || null, guide_id: guide.id, event_id: event.id,
    });

    if (error) {
      console.error("Visit insert failed", error);
      return NextResponse.json({ error: "Não foi possível registrar o agendamento." }, { status: 500 });
    }
    try {
      await sendVisitNotification({
        id: visitId,
        name,
        email,
        visitType: visitType as VisitType,
        date: body.requested_date as string,
        time: typeof body.requested_time === "string" ? body.requested_time : undefined,
        institutionName: institutionName || undefined,
        groupSize,
        otherDescription: otherDescription || undefined,
        notes: notes || undefined,
      });
    } catch (notificationError) {
      console.error("Visit notification error", notificationError);
      return NextResponse.json({
        ok: true,
        id: visitId,
        emailSent: false,
        message: "Visita registrada com sucesso, mas não foi possível enviar o e-mail de confirmação.",
      }, { status: 201 });
    }

    return NextResponse.json({ ok: true, id: visitId, emailSent: true, message: "Solicitação de visita recebida." }, { status: 201 });
  } catch (error) {
    console.error("VISIT API ERROR", error);
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }
}