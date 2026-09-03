import "server-only";
import nodemailer from "nodemailer";

export function createMailTransporter() {
  const gmailUser = process.env.GMAIL_USER;
  const smtpPassword = process.env.GMAIL_PASS || process.env.SMTP_PASSWORD;

  if (!gmailUser || !smtpPassword) {
    throw new Error("Configure GMAIL_USER e GMAIL_PASS (senha de app do Gmail) no .env.local");
  }

  return {
    gmailUser,
    transporter: nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT || 465),
      secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : true,
      auth: { user: gmailUser, pass: smtpPassword },
    }),
  };
}

export function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);
}