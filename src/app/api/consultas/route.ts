import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import nodemailer from "nodemailer";

type Consulta = {
  id: string;
  name: string;
  email: string;
  date?: string;
  notes?: string;
  price: number;
};

const CONSULTA_PRICE = 200;
const CONSULTA_NOTIFICATION_EMAIL = "museuilecontato@gmail.com"; 

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
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_PASS;

  if (!gmailUser || !gmailPass) {
    throw new Error("Configurações de e-mail (GMAIL_USER ou GMAIL_PASS) ausentes no arquivo .env");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailPass, 
    },
  });

  const safeName = escapeHtml(consulta.name);
  const safeEmail = escapeHtml(consulta.email);
  // Transforma de YYYY-MM-DD para DD/MM/YYYY
  const formattedDate = escapeHtml(consulta.date.split("-").reverse().join("/")); 
  const safeNotes = escapeHtml(consulta.notes || "Nenhuma observação informada.");

  // 1. E-MAIL PARA VOCÊ (ADMIN) - Design Clean e Organizado
  const adminMailOptions = {
    from: `"Museu Notificações" <${gmailUser}>`,
    to: CONSULTA_NOTIFICATION_EMAIL,
    subject: `[Museu] Nova consulta - ${consulta.name}`,
    text: `Nova solicitação de consulta de búzios de ${consulta.name}. Data: ${formattedDate}.`,
    html: `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #f4f4f4; padding: 20px; border-bottom: 1px solid #e0e0e0;">
        <h2 style="margin: 0; color: #222; font-size: 20px;">Nova Solicitação de Consulta</h2>
      </div>
      <div style="padding: 20px;">
        <p style="margin: 0 0 20px 0; font-size: 15px;">Você recebeu um novo agendamento de búzios. Confira os detalhes:</p>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; width: 120px;"><strong>Nome:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${safeName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>E-mail:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><a href="mailto:${safeEmail}" style="color: #B95843; text-decoration: none;">${safeEmail}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Data Desejada:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${formattedDate}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Valor:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee;">R$ ${CONSULTA_PRICE},00</td>
          </tr>
        </table>

        <div style="margin-top: 25px; background-color: #f9f9f9; padding: 15px; border-left: 4px solid #B95843; border-radius: 4px;">
          <strong style="display: block; margin-bottom: 8px; font-size: 14px;">Observações:</strong>
          <span style="font-size: 14px; white-space: pre-line; line-height: 1.5;">${safeNotes}</span>
        </div>

        <p style="font-size: 11px; color: #999; margin-top: 30px; text-align: center;">ID da solicitação: ${escapeHtml(consulta.id)}</p>
      </div>
    </div>
    `,
  };

  // 2. E-MAIL PARA O CLIENTE - Design com Identidade Visual
  const clientMailOptions = {
    from: `"Museu Ilê Asè Alaketù" <${gmailUser}>`, 
    to: consulta.email, 
    subject: `Confirmação de Agendamento - Consulta de Búzios`,
    text: `Olá ${consulta.name}, recebemos sua solicitação para a consulta de búzios na data ${formattedDate}.`,
    html: `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      
      <!-- Cabeçalho com o nome do Museu -->
      <div style="background-color: #2b2b2b; color: #ffffff; padding: 30px 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 22px; font-weight: normal; letter-spacing: 2px;">ILÈ ASÈ ALAKETÙ</h1>
        <p style="margin: 5px 0 0 0; font-size: 13px; color: #D77961; letter-spacing: 1px;">OYA IGBALE / MUSEU VIVO</p>
      </div>

      <!-- Corpo do E-mail -->
      <div style="padding: 30px 20px;">
        <h2 style="margin-top: 0; color: #222; font-size: 20px;">Olá, ${safeName}!</h2>
        <p style="font-size: 16px; line-height: 1.5; color: #555;">Recebemos com sucesso a sua solicitação para a consulta de búzios.</p>

        <!-- Caixa de Resumo -->
        <div style="background-color: #fdfaf9; border: 1px solid #f2e6e3; border-left: 5px solid #B95843; padding: 20px; border-radius: 4px; margin: 25px 0;">
          <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #222;">Resumo do seu agendamento:</h3>
          <p style="margin: 0 0 10px 0; font-size: 15px;"><strong>Data desejada:</strong> ${formattedDate}</p>
          <p style="margin: 0; font-size: 15px;"><strong>Valor:</strong> R$ ${CONSULTA_PRICE},00</p>
        </div>

        <p style="font-size: 16px; line-height: 1.5; color: #555;">Nossa equipe entrará em contato em breve através deste e-mail para confirmar o horário e passar as instruções de pagamento.</p>

        <p style="font-size: 16px; line-height: 1.5; margin-top: 30px; color: #333;">
          Axé e até logo,<br/>
          <strong>Equipe do Museu Ilê Asè Alaketù</strong>
        </p>
      </div>

      <!-- Rodapé -->
      <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #777;">
        Este é um e-mail automático. Por favor, aguarde nosso contato.
      </div>
    </div>
    `,
  };

  await Promise.all([
    transporter.sendMail(adminMailOptions),
    transporter.sendMail(clientMailOptions)
  ]);
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